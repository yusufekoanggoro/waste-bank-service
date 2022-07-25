module.exports = (sequelize, Sequelize) => {
    const Report = sequelize.define("report", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        transactionId: {
            field: 'transaction_id',
            type: Sequelize.STRING
        },
        wasteName: {
            field: 'nama_sampah',
            type: Sequelize.STRING
        },
        berat: {
            field: 'berat',
            type: Sequelize.INTEGER
        },
        hargaSatuan: {
            field: 'harga_satuan',
            type: Sequelize.INTEGER
        },
        harga: {
            field: 'harga',
            type: Sequelize.INTEGER
        },
        jenis: {
            type: Sequelize.ENUM,
            values: ['in', 'out']
        }
    });
    
    return Report;
};