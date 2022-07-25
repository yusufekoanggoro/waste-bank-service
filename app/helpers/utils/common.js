const xl = require('excel4node');
const path = require('path');
const moment = require('moment')

const makeExcelFile = (params) => {
    // console.log(params)
    let wb = new xl.Workbook();
    const transactionType = params.transactionType === 'in' ? 'Transaksi Masuk' : 'Transaksi Keluar';
    let ws = wb.addWorksheet(transactionType);

    const styleHeading = wb.createStyle({
        font: {
           color: '#000000',
           size: 10,
           bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
          },
     });
    const style = wb.createStyle({
        font: {
           color: '#000000',
           size: 10,
        }
     });

    let lengthArr = params.rows.map(v => v.transactionId.length)
    let maxWidth = Math.max(...lengthArr)
    ws.column(1).setWidth(maxWidth)
    lengthArr = params.rows.map(v => v.jenisSampah.length)
    maxWidth = Math.max(...lengthArr)
    ws.column(2).setWidth(25)

    lengthArr = params.rows.map(v => v.berat.length)
    maxWidth = Math.max(...lengthArr)
    ws.column(3).setWidth(10)

    lengthArr = params.rows.map(v => v.hargaSatuan.length)
    maxWidth = Math.max(...lengthArr)
    ws.column(4).setWidth(20)

    lengthArr = params.rows.map(v => v.harga.length)
    maxWidth = Math.max(...lengthArr)
    ws.column(5).setWidth(20)

    // lengthArr = params.map(v => v.createdAt.length)
    // maxWidth = Math.max(...lengthArr)
    ws.column(6).setWidth(20)

    ws.cell(1, 1)
    .string('Transaction ID')
    .style(styleHeading);

    ws.cell(1, 2)
    .string('Jenis Sampah')
    .style(styleHeading);

    ws.cell(1, 3)
    .string('Berat')
    .style(styleHeading);

    ws.cell(1, 4)
    .string('Harga Satuan')
    .style(styleHeading);

    ws.cell(1, 5)
    .string('Harga')
    .style(styleHeading);

    ws.cell(1, 6)
    .string('Created At')
    .style(styleHeading);

     let startRow = 2;
     let transactionIdBeforeIteration;
     for (let i = 0; i < params.rows.length; i++) {
        if(transactionIdBeforeIteration === params.rows[i].transactionId){
            ws.cell(startRow + i, 1)
            .string('')
            .style(style);

            ws.cell(startRow + i, 2)
            .string(params.rows[i].jenisSampah)
            .style(style);
            ws.cell(startRow + i, 3)
            .number(params.rows[i].berat)
            .style(style);
            ws.cell(startRow + i, 4)
            .number(params.rows[i].hargaSatuan)
            .style(style);
            ws.cell(startRow + i, 5)
            .number(params.rows[i].harga)
            .style(style);
            ws.cell(startRow + i, 6)
            .date(moment(params.rows[i].createdAt).format())
            .style(style);
        }else{
            ws.cell(startRow + i, 1)
            .string(params.rows[i].transactionId)
            .style(style);

            ws.cell(startRow + i, 2)
            .string(params.rows[i].jenisSampah)
            .style(style);
            ws.cell(startRow + i, 3)
            .number(params.rows[i].berat)
            .style(style);
            ws.cell(startRow + i, 4)
            .number(params.rows[i].hargaSatuan)
            .style(style);
            ws.cell(startRow + i, 5)
            .number(params.rows[i].harga)
            .style(style);
            ws.cell(startRow + i, 6)
            .date(moment(params.rows[i].createdAt).format())
            .style(style);
        }

        

        ws.cell(startRow + i)
        .string("asd")
        .style(style);

        transactionIdBeforeIteration = params.rows[i].transactionId;
     }
    // const buffer = wb.writeToBuffer().then((buffer) => {
    //     return buffer;
    // });
    // return buffer;
    wb.write(`${path.join(__dirname, `../../../public/reports/${params.fileName}`)}`);
}

module.exports = {
    makeExcelFile
}