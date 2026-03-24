const bcrypt = require('bcrypt');
const User = require('../models/User');
const Account = require('../models/Account');

//Register new user
const register = async (req, res) => {
    try {
        const { name, rut, email, password } = req.body;

        const existingUser = await User.findOne({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            rut,
            email,
            password: hashedPassword
        });

        await Account.create({
            type: 'Savings',
            balance: 0,
            userId: user.id
        });

        res.status(201).send('User registered succesfully')
    }   catch (error) {
        console.log(error);
        res.status(500).send('Error registering user');
    }
};

module.exports = {
    register
};
