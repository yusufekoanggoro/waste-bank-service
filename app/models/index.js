const config = require('../configs/global_config');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.get('/mysqlConfig').database, config.get('/mysqlConfig').user, config.get('/mysqlConfig').password, {
  host: config.get('/mysqlConfig').host,
  dialect: config.get('/mysqlConfig').dialect,

  pool: {
    max: config.get('/mysqlConfig').pool.max,
    min: config.get('/mysqlConfig').pool.min,
    acquire: config.get('/mysqlConfig').pool.acquire,
    idle: config.get('/mysqlConfig').pool.idle
  },
  timezone: 'Asia/Jakarta'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model")(sequelize, Sequelize);
db.wastes = require("./waste.model")(sequelize, Sequelize);
db.users = require("./user.model")(sequelize, Sequelize);
db.transactions = require("./transactions.model")(sequelize, Sequelize);
db.transactionWaste = require("./transaction_waste.model")(sequelize, Sequelize);


db.transactions.belongsToMany(db.wastes, {
  through: db.transactionWaste,
  as: "wastes",
  foreignKey: "transactionId",
});

db.wastes.belongsToMany(db.transactions, {
  through: db.transactionWaste,
  as: "transactions",
  foreignKey: "wasteId",
});

module.exports = db;