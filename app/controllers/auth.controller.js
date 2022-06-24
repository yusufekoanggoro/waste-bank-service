const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const jwtAuth = require('../helpers/auth/jwt_auth_helper');
const wrapper = require('../helpers/utils/wrapper');
const { ERROR, SUCCESS } = require('../helpers/utils/status_code');
const validator = require('../helpers/utils/validator');
const joiSchema = require('../helpers/utils/joi_schema');

// Sign In User
exports.authenticate = async (req, res) => {
    // Validate request
    const validatePayload = validator.isValidPayload(req.body, joiSchema.userSignIn);
    if (validatePayload.err) {
      return wrapper.response(res, 'fail', validatePayload, validatePayload.err, ERROR.BAD_REQUEST)
    }

    let result, user;

    user = validatePayload.data;
    let {username, password} = user;

    result = await Users.findOne({
        where: {
            username: username
        }
    });

    if(result){
        const isValidPassword = await bcrypt.compare(password, result.password);
        if(isValidPassword){
            const dataResponse = {
                username: result.username,
                sub: result.username
            };
            const accessToken = await jwtAuth.generateToken(dataResponse, '7d');
            dataResponse.accessToken = accessToken;
            return wrapper.response(res, 'success', dataResponse, 'Sign In Success', SUCCESS.OK)
        }else{
            return wrapper.response(res, 'fail', '', 'Username or password is incorrect', ERROR.UNAUTHORIZED)
        }
    }
    return wrapper.response(res, 'fail', '', 'Username or password is incorrect', ERROR.UNAUTHORIZED)
};