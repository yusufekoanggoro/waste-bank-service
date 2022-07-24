const moment = require('moment-timezone');

const mappingExcelRowTransaction = (params) => {
    const {transactionId, jenisSampah, berat, harga, satuan, total, createdAt} = params;

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
            type: String,
            value: `${berat}${satuan}`
        },
        {
            type: String,
            value: `${harga}/${satuan}`
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

const mappingDataForPDF = (params) => {
    const createdAt = moment().tz('Asia/Jakarta');
    const result = {
        header: {
            logo: "LOGO",
            nameApp: "Bank Sampah",
            corporateName: "PT. Wiwin Mutiara",
            contact: "Telp : 0234-xxxx"
        },
        createdAt: createdAt.format('DD/MM/YYYY HH:mm'),
        transactionId: params.transactionId,
        datas: params.datas.map( v => ({
            jenisSampah: v.jenisSampah,
            berat: `${v.berat}${v.satuan}`,
            harga: `${v.harga}/${v.satuan}`,
            rincian: v.total,
        })),
        tunai: params.tunai,
    }

    result.total = result.datas.reduce((partialSum, a) => partialSum + a.rincian, 0);
    result.kembalian = (result.tunai - result.total);
    return result;
}

module.exports = {
    mappingExcelRowTransaction,
    mappingDataForPDF
}