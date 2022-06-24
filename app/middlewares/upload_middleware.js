const multer = require('multer');
const { uuid } = require('uuidv4');
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/uploads"));
    },
    filename: function (req, file, cb) {
      cb(
        null,
        uuid()  + path.extname(file.originalname)
      );
    },
});

const upload = multer({storage: diskStorage});

module.exports = upload