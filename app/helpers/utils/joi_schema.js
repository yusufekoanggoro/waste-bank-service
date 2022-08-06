const joi = require('joi');
const joiDateFormat = require('@hapi/joi-date');
const joiExtend = joi.extend(joiDateFormat)

const wasteCreate = joi.object({
  jenisSampah: joi.string().required(),
  satuan: joi.string().valid('KG').required(),
  harga: joi.number().required(),
  gambar: joi.string().required(),
  deskripsi: joi.string().required(),
  type: joi.string().valid('in','out').required()
});

const userSignIn = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    role: joi.string().valid('admin','karyawan').optional()
});

const wasteDelete = joi.object({
  id: joi.number().required()
});

const wasteUpdate = joi.object({
  id: joi.number().required(),
  jenisSampah: joi.string().required(),
  satuan: joi.string().required(),
  harga: joi.number().required(),
  gambar: joi.string().default(""),
  deskripsi: joi.string().required(),
  type: joi.string().valid('in','out').required()
})

const wasteFindAll = joi.object({
  page: joi.number().required(),
  size: joi.number().required(),
  sort: joi.string().default("").optional(),
  type: joi.string().valid('in','out').default('in,out').optional(),
})

const transactionCreate = joi.object({
  transactionId: joi.string().required(),
  datas: joi.array().items({
    wasteId: joi.number().required(),
    berat: joi.number().required(),
  }),
  type: joi.string().valid('in','out').required(),
  tunai: joi.number().required(),
});

const transactionDelete = joi.object({
  id: joi.number().required()
});

const transactionUpdate = joi.object({
  id: joi.number().required(),
  transactionId: joi.string().optional(),
  jenisSampah: joi.string().required(),
  berat: joi.number().required(),
  harga: joi.number().required(),
  total: joi.number().required()
});

const transactionFindAll = joi.object({
  page: joi.number().required(),
  size: joi.number().required(),
  sort: joi.string().default("").optional(),
  startDate: joiExtend.date().format('YYYY-MM-DD').optional(),
  endDate: joiExtend.date().format('YYYY-MM-DD').when('startDate', {
    is: joiExtend.date().format('YYYY-MM-DD').optional(),
    then: joiExtend.date().format('YYYY-MM-DD').min(joi.ref('startDate')).required(),
  }).optional(),
  type: joi.string().valid('in','out').required()
});

const transactionExports = joi.object({
  startDate: joiExtend.date().format('YYYY-MM-DD').optional(),
  endDate: joiExtend.date().format('YYYY-MM-DD').when('startDate', {
    is: joiExtend.date().format('YYYY-MM-DD').optional(),
    then: joiExtend.date().format('YYYY-MM-DD').min(joi.ref('startDate')).required(),
  }).optional(),
  sort: joi.string().default("").optional(),
  type: joi.string().valid('in','out').required()
});

const transactionDownloadFile = joi.object({
  fileName: joi.string().required(),
});

const createReport = joi.object({
  startDate: joiExtend.date().format('YYYY-MM-DD').optional(),
  endDate: joiExtend.date().format('YYYY-MM-DD').when('startDate', {
    is: joiExtend.date().format('YYYY-MM-DD').optional(),
    then: joiExtend.date().format('YYYY-MM-DD').min(joi.ref('startDate')).required(),
  }).optional(),
  sort: joi.string().default("").optional(),
  type: joi.string().valid('in','out').required()
});

module.exports = {
    wasteCreate,
    userSignIn,
    wasteDelete,
    wasteUpdate,
    wasteFindAll,
    transactionCreate,
    transactionDelete,
    transactionUpdate,
    transactionFindAll,
    transactionExports,
    transactionDownloadFile,
    createReport
}