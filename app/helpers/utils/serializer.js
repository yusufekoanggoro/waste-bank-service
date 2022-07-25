const moment = require('moment-timezone');
const convertRupiah = require('rupiah-format')

const mappingExcelRowTransaction = (params) => {
    // const {transactionId, wastes, createdAt} = params;
    const result = []

    params.map( trns => {
        trns.wastes.map( wst => {
            result.push({
                transactionId: trns.transactionId,
                jenisSampah: wst.jenisSampah,
                berat: wst.transaction_waste.berat,
                harga: (wst.transaction_waste.berat * wst.harga),
                createdAt: trns.createdAt,
                hargaSatuan:  wst.harga
            })
        })
    })
    return result;
}

const mappingDataForPDF = (params) => {
    const createdAt = moment(params.createdAt).tz('Asia/Jakarta');
    const result = {
        header: {
            logo: "LOGO",
            nameApp: "Bank Sampah",
            corporateName: "PT. Wiwin Mutiara",
            contact: "Telp : 0234-xxxx"
        },
        createdAt: createdAt.format('DD/MM/YYYY HH:mm'),
        transactionId: params.transactionId,
        datas: params.wastes.map( v => ({
            jenisSampah: v.jenisSampah,
            berat: `${v.transaction_waste.berat}${v.satuan}`,
            harga: `${v.harga}/${v.satuan}`,
            rincian: (v.transaction_waste.berat * v.harga),
        })),
        tunai: params.tunai,
    }

    result.total = result.datas.reduce((partialSum, a) => partialSum + a.rincian, 0);
    result.kembalian = (result.tunai - result.total);
    return result;
}

const mappingGetTransactionByDate = (params) => {
    const result = {transactionDetail: [], total: 0}
    params.map( v => {
        result.transactionDetail.push({
            transactionId: v.transactionId,
            createdAt: moment(v.createdAt).format('DD/MM/YYYY'),
            jumlahSampah: v.wastes.length,
            rincian: v.wastes.map( vv => ({
                rincian: (vv.transaction_waste.berat * vv.harga),
            })).reduce((partialSum, a) => partialSum + a.rincian, 0)
        })
    })
    result.total = result.transactionDetail.reduce((partialSum, a) => partialSum + a.rincian, 0);
    return result;
}

module.exports = {
    mappingExcelRowTransaction,
    mappingDataForPDF,
    mappingGetTransactionByDate
}