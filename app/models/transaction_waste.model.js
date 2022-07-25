module.exports = (sequelize, Sequelize) => {
    const TransactionWaste = sequelize.define("transaction_waste", {
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
        wasteId: {
            field: 'waste_id',
            type: Sequelize.INTEGER
        },
        berat: {
            field: 'berat',
            type: Sequelize.INTEGER
        },
    });
    
    return TransactionWaste;
};