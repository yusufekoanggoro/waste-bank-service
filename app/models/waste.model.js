const models = require('./index');
module.exports = (sequelize, Sequelize) => {
    const Waste = sequelize.define("waste", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        jenisSampah: {
            field: 'jenis_sampah',
            type: Sequelize.STRING
        },
        satuan: {
            type: Sequelize.STRING
        },
        harga: {
            type: Sequelize.INTEGER
        },
        gambar: {
            type: Sequelize.STRING
        },
        deskripsi: {
            type: Sequelize.STRING
        },
    });

    return Waste;
};