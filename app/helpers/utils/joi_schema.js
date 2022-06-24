const joi = require('joi');

const wasteCreate = joi.object({
  jenisSampah: joi.string().required(),
  satuan: joi.string().required(),
  harga: joi.number().required(),
  gambar: joi.string().required(),
  deskripsi: joi.string().required(),
});

const userSignIn = joi.object({
    username: joi.string().required(),
    password: joi.string().required()
});

module.exports = {
    wasteCreate,
    userSignIn
}