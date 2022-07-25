const jwtAuth = require('../helpers/auth/jwt_auth_helper');

module.exports = app => {
    const transactions = require("../controllers/transaction.controller");
  
    var router = require("express").Router();
  
    router.post("/", jwtAuth.verifyToken, transactions.create);
    router.post("/:id", jwtAuth.verifyToken, transactions.delete);
    router.put("/:id", jwtAuth.verifyToken, transactions.update);
    // router.put("/:id", jwtAuth.verifyToken, uploadMiddleware.single('gambar'), wastes.update);
    router.get("/", jwtAuth.verifyToken, transactions.findAll);
    router.get("/exports", jwtAuth.verifyToken, transactions.exportData);
    router.get('/downloads/:fileName', transactions.download);
    router.get("/reports", jwtAuth.verifyToken, transactions.createReport);

    app.use('/api/transactions', router);
};