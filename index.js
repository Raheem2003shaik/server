const express = require('express');
const app = express();
const userModel = require('./db');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("hiiii");
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: `Error while fetching users ${error}`});
    }
});

app.post('/api/check-user', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await userModel.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'Username does not exist' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        res.status(200).json({ message: 'User authenticated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
});

app.post('/api/create-user', async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const saltRounds = 6;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const existingUser = await userModel.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const existingEmail = await userModel.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ message : 'Email already exists'});
        }
        const newUser = new userModel({
            userName,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error while creating account: ${error}` });
    }
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server running on http://localhost:${PORT}`);
});
