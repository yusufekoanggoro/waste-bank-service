
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../configs/global_config');
const wrapper = require('../utils/wrapper')
const { ERROR } = require('../utils/status_code')
const db = require("../../models");
const Users = db.users;

const getKey = keyPath => fs.readFileSync(keyPath, 'utf8');

const generateToken = async (data) => {
  const privateKey = getKey(config.get('/privateKey'));
  const verifyOptions = {
    algorithm: 'RS256',
    audience: '97b331dh93-4hil3ff-4e83358-9848124-b3aAsd9b9f72c34',
    issuer: 'sanstock',
    expiresIn: '7d'
  };
  const token = jwt.sign(data, privateKey, verifyOptions);
  return token;
};

const getToken = (headers) => {
    if (headers && headers.authorization && headers.authorization.includes('Bearer')) {
      const parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      }
    }
    return undefined;
};
  
const verifyToken = async (req, res, next) => {
  const result = {
    err: null,
    data: null
  };
  const publicKey = fs.readFileSync(config.get('/publicKey'), 'utf8');
  const verifyOptions = {
    algorithm: 'RS256',
    audience: '97b331dh93-4hil3ff-4e83358-9848124-b3aAsd9b9f72c34',
    issuer: 'sanstock'
  };

  const token = getToken(req.headers);
  if (!token) {
    return wrapper.response(res, 'fail', result, 'Invalid token!', ERROR.FORBIDDEN);
  }
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, publicKey, verifyOptions);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return wrapper.response(res, 'fail', result, 'Token is expired', ERROR.UNAUTHORIZED);
    }
    return wrapper.response(res, 'fail', result, 'Token is not valid!', ERROR.UNAUTHORIZED);
  }

  const username = decodedToken.sub;
  const user = await Users.findOne({
    where: {
      username: username
    }
  });
  if (!user) {
    return wrapper.response(res, 'fail', result, 'Invalid token!', ERROR.FORBIDDEN);
  }

  req.user =  {
    username
  };
  next();
};

module.exports = {
    generateToken,
    verifyToken
}