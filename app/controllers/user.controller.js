const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const wrapper = require('../helpers/utils/wrapper');
const { ERROR, SUCCESS } = require('../helpers/utils/status_code');
const validator = require('../helpers/utils/validator');
const joiSchema = require('../helpers/utils/joi_schema');

// Create and Save a new User
exports.create = async (req, res) => {
    // Validate request
    const validatePayload = validator.isValidPayload(req.body, joiSchema.userSignIn);
    if (validatePayload.err) {
      return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
    }

    let result, user;

    user = validatePayload.data;
    let { username, password } = user;

    result = await Users.findOne({
        where: {
            username: username
        }
    });
    if(result){
        return wrapper.response(res, 'success', '', 'Username already exists', SUCCESS.OK)
    }else{
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        Users.create(user)
            .then(data => {
                return wrapper.response(res, 'success', data, "Success", SUCCESS.CREATED)
            })
            .catch(err => {
                return wrapper.response(res, 'fail', err, err.message || "Some error occurred while creating the Waste.", ERROR.INTERNAL_ERROR)
            });
    }
};