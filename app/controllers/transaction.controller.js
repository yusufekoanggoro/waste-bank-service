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

exports.create = async (req, res) => {
  const validatePayload = validator.isValidPayload(req.body, joiSchema.transactionCreate);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }
  const requestData = validatePayload.data;

  Transactions.create(requestData)
    .then(async data => {
      let excelData = [
        constants.HEADER_ROW,
      ];
      const dataArray = []
      dataArray.push(data.get({plain:true}));
      dataArray.map( v => {
        excelData.push(serializer.mappingExcelRowTransaction(v))
      })
      const fileName = `${moment().valueOf()}.xlsx`
      await commonUtils.makeExcelFile({rows: dataArray, fileName, transactionType: requestData.type});
      // let binarybuffer = new Buffer(buffer, 'binary');
      // res.attachment(`${moment().valueOf()}.xlsx`); 
      return wrapper.response(res, 'success', {fileName}, "Success", SUCCESS.CREATED)
    })
    .catch(err => {
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
    // where: { id: waste.id }
    order: [
      (requestData.sort !== '') ? [sortData[0], sortData[1].toUpperCase()]  : ['createdAt', 'DESC']
    ],
    limit: requestData.size,
    offset: (requestData.page-1),
  })
    .then(data => {
      let pagingData = paging(req.query.page, req.query.size, data.count)
      return wrapper.paginationResponse(res, 'success', data.rows, "Success", SUCCESS.OK, pagingData)
    })
    .catch(err => {
      return wrapper.response(res, 'fail', err, "Failed", ERROR.INTERNAL_ERROR)
    });
}

exports.exportsData = async (req, res) => {
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
            [Op.gte]: requestData.startDate,
            [Op.lt]: requestData.endDate,
        }
      },
      order: [
        (requestData.sort !== '') ? [sortData[0], sortData[1].toUpperCase()]  : ['createdAt', 'DESC']
      ],
      raw: true,
    })
      .then(async (data) => {
          let excelData = [
            constants.HEADER_ROW,
          ];
          data.rows.map( v => {
            excelData.push(serializer.mappingExcelRowTransaction(v))
          })
          let fileName = `${moment().valueOf()}.xlsx`
        await commonUtils.makeExcelFile({rows: data.rows, fileName, transactionType: requestData.type});
        // let binarybuffer = new Buffer(buffer, 'binary');
        // res.attachment(`${moment().valueOf()}.xlsx`); 
        return wrapper.response(res, 'success', {fileName}, "Success", SUCCESS.OK)
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

    const file = path.join(__dirname, `../../public/uploads/${requestData.fileName}`);

    res.download(file);
}