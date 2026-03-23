//FutureTransfer model represents scheduled transactions

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const FutureTransfer = db.define('FutureTransfer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    executionDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    }
});

module.exports = FutureTransfer;