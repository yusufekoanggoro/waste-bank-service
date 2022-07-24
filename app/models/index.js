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
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model")(sequelize, Sequelize);
db.wastes = require("./waste.model")(sequelize, Sequelize);
db.users = require("./user.model")(sequelize, Sequelize);
db.transactions = require("./transactions.model")(sequelize, Sequelize);

// db.wastes.belongsTo(db.transactions);
// db.transactions.hasMany(db.wastes, {foreignKey: 'id', as: "wastes"});
// db.transactions.belongsToMany(db.wastes, {
//   foreignKey: 'id', // <--- one of the column of table2 - SubTask: not a primary key here in my case; can be primary key also
//   sourceKey: 'wasteId',
//   through: 'transactions_wastes'
// });
// db.wastes.belongsTo(db.transactions, {
//   foreignKey: "transaction_id",
//   as: "transaction",
// });

module.exports = db;