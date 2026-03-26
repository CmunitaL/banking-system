const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const FutureTransfer = require('../models/FutureTransfer');
const { Op } = require('sequelize');

//Transfer money between accounts
const transfer = async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount } = req.body;

        const fromAccount = await Account.findByPk(fromAccountId);
        const toAccount = await Account.findByPk(toAccountId);

        if (!fromAccount || !toAccount) {
            return res.status(404).send('Account not found');
        }
        if (!fromAccount.balance < amount) {
            return res.status(400).send('Insufficient funds');
        }

        //update balance
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await fromAccount.save();
        await toAccount.save();

        //Save transaction
        await Transaction.create({
            amount,
            type: 'transfer',
            accountId: fromAccount.id
        });

        res.send('Transfer successful');

    } catch (error) {
        console.log(error);
        res.status(500).send('Error processing transfer');
    }
}; 

//Get accounts for the autheticated user
const getMyAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            where: {
                userId: req.session.userId
            }
        });

        res.json(accounts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error getting accounts');
    }
};

//Loan
const requestLoan = async (res, req) => {
    try {
        const { accountId, amount } = req.body;
        const account = await Account .findByPk(accountId);
        if (!account) {
            return res.status(404).send('Account not found');
        }
        if (account.userId !== req.session.userId) {
            return res.status(403).send('This account does not belong to the user');
        }

        account.balance += amount;
        await account.save();

        await Transaction.create({
            amount,
            type: 'loan',
            accountId: account.id
        });

        res.send('Loan approved succesfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error processing loan');
    }
};

//Schedule a future transfer
const scheduleTransfer = async (req, res) => {
    try {
        const { accountId, amount, executionDate } = req.body;
        const account = await Account.findByPk(accountId);

        if (!account) {
            return res.status(404).send('Account not found');
        }
        if (account.userId !== req.session.userId) {
            return res.status(403).send('This account does not belong to the user');
        }
        await FutureTransfer.create({
            amount,
            executionDate,
            status: 'pending',
            accountId: account.id
        });
        res.send('Future transfer scheduled succesfully');
    }   catch (error) {
        console.log(error);
        res.status(500).send('Error scheduling future transfer');
    }
};
//Transaction history
const getMyTransactions = async (req, res) => {
    try {
        const account = await Account.findAll({
            where: {
                userId: req.session.userId
            }
        });
        const accountIds = account.map(account => account.id);
        const Transaction = await Transaction.findAll({
            where: {
                accountId: {
                    [Op.in]: accountIds
                }
            },
            order: [['date', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error getting transactions'); 
    }
};




module.exports = {
    transfer,
    getMyAccounts,
    requestLoan,
    scheduleTransfer,
    getMyTransactions
};