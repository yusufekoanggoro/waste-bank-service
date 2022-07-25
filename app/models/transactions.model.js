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
        tunai: {
            field: 'tunai',
            type: Sequelize.INTEGER
        },
        type: {
            field: 'jenis',
            type: Sequelize.ENUM,
            values: ['in', 'out']
        }
    });
    
    return Transaction;
};