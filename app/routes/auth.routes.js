module.exports = app => {
    const auths = require("../controllers/auth.controller");
  
    var router = require("express").Router();
  
    router.post("/", auths.authenticate);
  
    app.use('/api/auth', router);
};