require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  serviceName: process.env.SERVICE_NAME,
  mysqlConfig: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  publicKey: process.env.PUBLIC_KEY_PATH,
  privateKey: process.env.PRIVATE_KEY_PATH,
}

const store = new confidence.Store(config);

exports.get = key => store.get(key);