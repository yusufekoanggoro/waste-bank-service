const express = require('express');
const config = require('./app/configs/global_config');
const db = require("./app/models");

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

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

require("./app/routes/tutorial.routes")(app);

app.listen(config.get('/port'), () => {
  console.log(`[${config.get('/serviceName')}]: Server is running at https://localhost:${config.get('/port')}`);
});