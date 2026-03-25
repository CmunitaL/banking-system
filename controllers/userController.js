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

//User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }
        req.session.userId = user.id;

        res.send('Login succesful');

    } catch (error) {
        console.log(error);
        res.status(500).send('Error logging in');
    }
};

//User logout
const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).send('Error logging out');
        }
        res.send('Logout successful');
    });
};

//Get authenticated user profile
const getProfile = async (req, res) => {
    try {
        const user = await  User.findByPk(req.session.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error getting profile')
    }
};


module.exports = {
    register,
    login,
    logout,
    getProfile
};
