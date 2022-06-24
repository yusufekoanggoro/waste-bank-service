const db = require("../models");
const Wastes = db.wastes;
const Op = db.Sequelize.Op;
const wrapper = require('../helpers/utils/wrapper');
const validator = require('../helpers/utils/validator');
const joiSchema = require('../helpers/utils/joi_schema');
const { ERROR, SUCCESS } = require('../helpers/utils/status_code');

// Create and Save a new Waste
exports.create = async (req, res) => {
  // Validate request
  req.body.gambar = req.file.filename;
  const validatePayload = validator.isValidPayload(req.body, joiSchema.wasteCreate);
  if (validatePayload.err) {
    return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
  }

  let waste;

  // Create a Waste
  waste = validatePayload.data;

  // Save Waste in the database
  Wastes.create(waste)
    .then(data => {
      return wrapper.response(res, 'success', data, "Success", SUCCESS.CREATED)
    })
    .catch(err => {
      return wrapper.response(res, 'fail', data, err.message || "Some error occurred while creating the Waste.", ERROR.INTERNAL_ERROR)
    });
};