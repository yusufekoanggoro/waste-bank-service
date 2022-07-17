const jwtAuth = require('../helpers/auth/jwt_auth_helper');
const uploadMiddleware = require('../middlewares/upload_middleware')

module.exports = app => {
    const wastes = require("../controllers/waste.controller");
  
    var router = require("express").Router();
  
    router.post("/", jwtAuth.verifyToken, uploadMiddleware.single('gambar'), wastes.create);
    router.post("/:id", jwtAuth.verifyToken, wastes.delete);
    router.put("/:id", jwtAuth.verifyToken, uploadMiddleware.single('gambar'), wastes.update);
    router.put("/:id", jwtAuth.verifyToken, uploadMiddleware.single('gambar'), wastes.update);
    router.get("/", jwtAuth.verifyToken, wastes.findAll);
  
    app.use('/api/wastes', router);
};