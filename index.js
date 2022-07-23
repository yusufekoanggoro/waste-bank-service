const express = require('express');
const config = require('./app/configs/global_config');
const db = require("./app/models");
const path = require('path');

const app = express();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(express.static(path.resolve('./public/uploads')));
app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

require("./app/routes/tutorial.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/waste.routes")(app);
require("./app/routes/transaction.routes")(app);

app.listen(config.get('/port'), () => {
  console.log(`[${config.get('/serviceName')}]: Server is running at https://localhost:${config.get('/port')}`);
});