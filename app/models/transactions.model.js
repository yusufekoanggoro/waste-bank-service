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
        wasteId: {
            field: 'waste_id',
            type: Sequelize.INTEGER,
            references: {
                model: 'wastes',
                key: 'id',
            }
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