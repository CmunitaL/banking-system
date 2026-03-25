//Initialize Express application
const express = require('express');
const app = express();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const User = require('./models/User');
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');
const FutureTransfer = require('./models/FutureTransfer');

require('./models/associations');

const userRoutes = require('./routes/userRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const operationRoutes = require('./routes/operationRoutes');

app.use('/operations', operationRoutes);


const db = require('./config/db');

const sessionStore = new SequelizeStore({
    db: db
});

app.use(session({ 
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

sessionStore.sync();

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Project Fidelis Bank running');
});

db.sync({ alter: true })
    .then(() => console.log('Tables synced'))
    .catch(err => console.log(err));

db.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error:', err));

app.listen(3000, () => {
    console.log('Running server');

});