const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

require('dotenv').config();

const router = express.Router();

const createToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

router.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [username, email, hashedPassword]);

    return res.status(201).json({ message: 'User created', user: newUser.rows[0] });
});

router.post("/login", async(req, res) => {

    const { email, password } = req.body;

    const user = await db.query("SELECT * FROM users WHERE username = $1", [email]);

    if (!(user.rows.length > 0)) {
        return res.status(404).json({ message: 'User does not exists' });
    }

    const match = await bcrypt.compare(password, user.rows[0].password);

    if(!match) {
        res.status(400).json({ message: "Invalid Credentials" });
    }

    const accessToken = createToken({ 
        id: user.rows[0].id,
        email: user.rows[0].email,
    });

    res.status(201).json({ message: "Successful login", accessToken });
});

router.get("/validate", async(req, res) => {
    
    // Get token value to the json body
    const token = req.headers["authorization"];

    // If the token is present
    if(!token){
        // Return response with error
        res.status(401).json({
            login: false,
            message: 'Unauthorization'
        });
    }
    
    try {
        // Verify the token using jwt.verify method
        const user = jwt.verify(token, process.env.JWT_SECRET);

        //  Return response with decode data
        res.status(200).json({
            ...user
        });
    } catch(e) {
        res.status(403).json({
            login: false,
            message: 'Invalid token'
        });
    }
});

module.exports = router;
