const db = require("../models");
const Transactions = db.transactions;
const Op = db.Sequelize.Op;
const wrapper = require('../helpers/utils/wrapper');
const validator = require('../helpers/utils/validator');
const joiSchema = require('../helpers/utils/joi_schema');
const { ERROR, SUCCESS } = require('../helpers/utils/status_code');
const path = require('path');
const { paging } = require('../helpers/utils/pagination');
const { uuid } = require('uuidv4');
const moment = require('moment');
const writeXlsxFile = require('write-excel-file');
const constants = require('../helpers/utils/constants');
const serializer = require('../helpers/utils/serializer');
const commonUtils = require('../helpers/utils/common');
var mime = require('mime');
var fs = require('fs');
const pdf = require('html-pdf');
const ejs = require('ejs');
const Wastes = db.wastes;
const TransactionsWaste = db.transactionWaste;
const Reports = db.reports;


exports.create = async (req, res) => {
  const validatePayload = validator.isValidPayload(req.body, joiSchema.transactionCreate);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }
  const requestData = validatePayload.data;

  const transaction = {
    transactionId: requestData.transactionId,
    jenis: requestData.type,
    tunai: requestData.tunai
  };

  Transactions.create(transaction)
    .then(async data => {
      const transactionWaste = requestData.datas.map( v => ({
        transactionId: data.id,
        wasteId: v.wasteId,
        berat: v.berat
      }))
      console.log(transactionWaste)
      TransactionsWaste.bulkCreate(transactionWaste)
        .then( async result => {
          Transactions.findOne({
            where: { id: data.id},
            include: [
              {
                model: Wastes,
                as: "wastes"
              }
            ]
          }).then( async result => {
            const pdfData = serializer.mappingDataForPDF(result);
            const templateEJS = 'report.ejs';
            const fileName = `${moment().valueOf()}.pdf`;
            await ejs.renderFile(path.join(__dirname, '../../files', templateEJS), { transaction: pdfData}, async (err, data) => {
              if (err) {
                res.send(err);
              } else {
                const options = {
                  width: '350px',
                };
      
                await pdf.create(data, options).toFile(`./public/reports/${fileName}`, async (err, res) => {
                    if (err) return console.log(err);
                    // console.log(res); // { filename: '/app/businesscard.pdf' }
                });
                // return pdf.create(data, options).toStream((err, stream) => {
                //   stream.pipe(res);
                // });
              }
            });
            return wrapper.response(res, 'success', {fileName : `/reports/${fileName}`}, "Success", SUCCESS.CREATED)
          })
        })
    })
    .catch(err => {
      console.log(err)
      return wrapper.response(res, 'fail', err, "Failed", ERROR.INTERNAL_ERROR)
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const validatePayload = validator.isValidPayload({id}, joiSchema.transactionDelete);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }

  let result, transaction;

  result = await Transactions.findOne({
    where: {
        id: id
    }
  });

  if(result === null){
    return wrapper.response(res, 'success', result, "Data Not Found", ERROR.NOT_FOUND)
  }
  transaction = result;
  
  Transactions.destroy({
    where: { id: id }
  })
    .then(data => {
      return wrapper.response(res, 'success', data, "Success", SUCCESS.OK)
    })
    .catch(err => {
      return wrapper.response(res, 'fail', err, "Failed", ERROR.INTERNAL_ERROR)
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const payload = { id, ...req.body }
  const validatePayload = validator.isValidPayload(payload, joiSchema.transactionUpdate);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }

  let result, transaction, requestData;

  result = await Transactions.findOne({
    where: {
        id: id
    }
  });

  if(result === null){
    return wrapper.response(res, 'success', result, "Data Not Found", ERROR.NOT_FOUND)
  }
  transaction = result;
  requestData = validatePayload.data;

  requestData.transactionId = transaction.transactionId
  delete requestData.id
  Transactions.update(requestData,{
    where: { id: transaction.id }
  })
    .then(data => {
      return wrapper.response(res, 'success', data, "Success", SUCCESS.OK)
    })
    .catch(err => {
      return wrapper.response(res, 'fail', err, "Failed", ERROR.INTERNAL_ERROR)
    });
};

exports.findAll = async (req, res) => {
  let { query } = req;
  const validatePayload = validator.isValidPayload(query, joiSchema.transactionFindAll);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }
  const requestData = validatePayload.data;
  
  let sortData = requestData.sort.split(':')
  Transactions.findAndCountAll({
    where: { 
      createdAt: {
          [Op.gte]: moment(requestData.startDate).toDate(),
          [Op.gte]: moment(requestData.endDate).toDate()
      },
      type: requestData.type
    },
    order: [
      (requestData.sort !== '') ? [sortData[0], sortData[1].toUpperCase()]  : ['createdAt', 'DESC']
    ],
    limit: requestData.size,
    offset: (requestData.page-1),
    include: [ { 
      model: Wastes, 
      as: "wastes"
    }],
    distinct: true
  })
    .then(data => {
      let pagingData = paging(req.query.page, req.query.size, data.count);
      const transactionWastes = serializer.mappingGetTransactionByDate(data.rows);
      return wrapper.paginationResponse(res, 'success', transactionWastes.transactionDetail, "Success", SUCCESS.OK, pagingData)
    })
    .catch(err => {
      return wrapper.response(res, 'fail', err, "Failed", ERROR.INTERNAL_ERROR)
    });
}

exports.exportData = async (req, res) => {
    let { query } = req;
    const validatePayload = validator.isValidPayload(query, joiSchema.transactionExports);
    if (validatePayload.err) {
      return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
    }
    const requestData = validatePayload.data;

    let sortData = requestData.sort.split(':')
    Transactions.findAndCountAll({
      where: { 
        createdAt: {
            // [Op.between]: [moment(requestData.startDate).toDate(), moment(requestData.endDate).toDate()]
            [Op.gte]: moment(requestData.startDate).toDate(),
            [Op.gte]: moment(requestData.endDate).toDate()
        },
        type: requestData.type
      },
      order: [
        (requestData.sort !== '') ? [sortData[0], sortData[1].toUpperCase()]  : ['createdAt', 'DESC']
      ],
      include: [ { 
        model: Wastes, 
        as: "wastes"
      }],
      distinct: true
    })
      .then(async (data) => {
          if(data.rows.length > 0){
            const excelData = serializer.mappingExcelRowTransaction(data.rows)
            let fileName = `${moment().valueOf()}.xlsx`;
            await this.createReport(req, res);
            await commonUtils.makeExcelFile({rows: excelData, transactionType: requestData.type, fileName});
            return wrapper.response(res, 'success', {fileName: `/reports/${fileName}`}, "Success", SUCCESS.OK)
          }
          return wrapper.response(res, 'success', [], "Data Not Found", ERROR.NOT_FOUND)
      })
      .catch(err => {
          console.log(err)
        return wrapper.response(res, 'fail', err, "Failed", ERROR.INTERNAL_ERROR)
      });
}

exports.download = async (req, res) => {
    let { params } = req;
    const validatePayload = validator.isValidPayload(params, joiSchema.transactionDownloadFile);
    if (validatePayload.err) {
      return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
    }
    const requestData = validatePayload.data;

    const file = path.join(__dirname, `../../public/reports/${requestData.fileName}`);

    res.download(file);
}

exports.createReport = async (req, res) => {
  let { query } = req;
    const validatePayload = validator.isValidPayload(query, joiSchema.createReport);
    if (validatePayload.err) {
      return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
    }
    const requestData = validatePayload.data;

    let sortData = requestData.sort.split(':')
    Transactions.findAndCountAll({
      where: { 
        createdAt: {
            // [Op.between]: [moment(requestData.startDate).toDate(), moment(requestData.endDate).toDate()]
            [Op.gte]: moment(requestData.startDate).toDate(),
            [Op.gte]: moment(requestData.endDate).toDate()
        },
        jenis: requestData.type
      },
      order: [
        (requestData.sort !== '') ? [sortData[0], sortData[1].toUpperCase()]  : ['createdAt', 'DESC']
      ],
      include: [ { 
        model: Wastes, 
        as: "wastes"
      }],
      distinct: true
    })
      .then(async (data) => {
        const reports = serializer.reportCreateBulk(data.rows);
        Reports.bulkCreate(reports)
        .then( result => {
          return true
        })
      })
      .catch(err => {
          console.log(err)
        return false
      });
}