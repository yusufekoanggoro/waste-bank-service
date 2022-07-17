const moment = require('moment');

const mappingExcelRowTransaction = (params) => {
    const {transactionId, jenisSampah, berat, harga, total, createdAt} = params;

    const result = [
        {
            type: String,
            value: transactionId
        },
        {
            type: String,
            value: jenisSampah
        },
        {
            type: Number,
            value: berat
        },
        {
            type: Number,
            value: harga
        },
        {
            type: Number,
            value: total
        },
        {
            type: Date,
            // value: moment(createdAt).add(7, 'hours').format(),
            value: new Date(createdAt),
            format: 'dd/mm/yyyy'
        }
    ]
    return result;
}

module.exports = {
    mappingExcelRowTransaction
}