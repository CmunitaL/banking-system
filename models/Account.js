//Account model represents a bank account associated with a user
//Used to manage balances and financial operations

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Account = db.define('Account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Account;