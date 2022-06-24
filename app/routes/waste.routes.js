const jwtAuth = require('../helpers/auth/jwt_auth_helper');
const uploadMiddleware = require('../middlewares/upload_middleware')

module.exports = app => {
    const wastes = require("../controllers/waste.controller");
  
    var router = require("express").Router();
  
    router.post("/", jwtAuth.verifyToken, uploadMiddleware.single('gambar'), wastes.create);
  
    app.use('/api/wastes', router);
};