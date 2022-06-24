module.exports = app => {
    const users = require("../controllers/user.controller");
  
    var router = require("express").Router();

    router.post("/", users.create);
  
    app.use('/api/users', router);
};