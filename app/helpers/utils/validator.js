const joi = require('joi');
const validate = require('validate.js');
const wrapper = require('./wrapper');

const isValidPayload = (payload, constraint) => {
  const {value, error} = constraint.validate(payload);
  if(!validate.isEmpty(error)){
    return wrapper.error(error.details[0].message);
  }
  return wrapper.data(value, 'success', 200);
};

module.exports = {
    isValidPayload
}