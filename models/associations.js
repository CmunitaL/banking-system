const User = require('./User');
const Account = require('./Account');
const Transaction = require('./Transaction');
const FutureTransfer = require('./FutureTransfer');

//A User can have multiple accounts
User.hasMany(Account, {
    foreignKey: 'userId'
});

//Each account belong to a single user
Account.belongsTo(User, {
    foreignKey: 'userId'
});

//An account  can have multiple transactions
Account.hasMany(Transaction, {
    foreignKey: 'accountId'
});

//Each transaction belong to a single account
Transaction.belongsTo(Account, {
    foreignKey: 'accountId'
});

//An account can have many scheduled transactions
Account.hasMany(FutureTransfer, {
    foreignKey: 'accountId'
});

//Each scheduled transfer belongs to one account
FutureTransfer.belongsTo(Account, {
    foreignKey: 'accountId'
});