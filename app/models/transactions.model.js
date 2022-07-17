module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
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
        jenisSampah: {
            field: 'jenis_sampah',
            type: Sequelize.STRING
        },
        berat: {
            type: Sequelize.INTEGER
        },
        harga: {
            type: Sequelize.INTEGER
        },
        total: {
            type: Sequelize.INTEGER
        },
        jenis: {
            type: Sequelize.ENUM,
            values: ['in', 'out']
        }
    });
    
    return Transaction;
};