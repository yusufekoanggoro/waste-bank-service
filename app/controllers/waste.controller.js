const db = require("../models");
const Wastes = db.wastes;
const Op = db.Sequelize.Op;
const wrapper = require('../helpers/utils/wrapper');
const validator = require('../helpers/utils/validator');
const joiSchema = require('../helpers/utils/joi_schema');
const { ERROR, SUCCESS } = require('../helpers/utils/status_code');
const fs = require('fs');
const path = require('path');
const { paging } = require('../helpers/utils/pagination');

exports.create = async (req, res) => {
  req.body.gambar = req.file.filename;
  const validatePayload = validator.isValidPayload(req.body, joiSchema.wasteCreate);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }
  const requestData = validatePayload.data;

  Wastes.create(requestData)
    .then(data => {
      return wrapper.response(res, 'success', data, "Success", SUCCESS.CREATED)
    })
    .catch(err => {
      return wrapper.response(res, 'fail', err, "Failed", ERROR.INTERNAL_ERROR)
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const validatePayload = validator.isValidPayload({id}, joiSchema.wasteDelete);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }

  let result, waste;

  result = await Wastes.findOne({
    where: {
        id: id
    }
  });

  if(result === null){
    return wrapper.response(res, 'success', result, "Data Not Found", ERROR.NOT_FOUND)
  }
  waste = result;

  try {
    fs.unlinkSync(path.join(__dirname, `../../public/uploads/${waste.gambar}`))
  } catch (error) {
    return wrapper.response(res, 'fail', error, "Failed", ERROR.BAD_REQUEST);  
  }
  
  Wastes.destroy({
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
  if (req.file) req.body.gambar = req.file.filename

  const payload = { id, ...req.body }
  const validatePayload = validator.isValidPayload(payload, joiSchema.wasteUpdate);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }

  let result, waste, wasteUpdate;

  result = await Wastes.findOne({
    where: {
        id: id
    }
  });

  if(result === null){
    return wrapper.response(res, 'success', result, "Data Not Found", ERROR.NOT_FOUND)
  }
  waste = result;
  wasteUpdate = validatePayload.data;
  try {
    if(wasteUpdate.gambar !== '') {
      fs.unlinkSync(path.join(__dirname, `../../public/uploads/${waste.gambar}`))
    }else{
      wasteUpdate.gambar = waste.gambar;
    }
  } catch (error) {
    return wrapper.response(res, 'fail', error, "Failed", ERROR.BAD_REQUEST);  
  }

  delete wasteUpdate.id
  Wastes.update(wasteUpdate,{
    where: { id: waste.id }
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
  const validatePayload = validator.isValidPayload(query, joiSchema.wasteFindAll);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }
  const requestData = validatePayload.data;

  let sortData = requestData.sort.split(':')
  Wastes.findAndCountAll({
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