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
        wasteId: {
            field: 'waste_id',
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
    
    return Report;
};