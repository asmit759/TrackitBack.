import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import sendOtpEmail from '../utils/sendOtp.js';
import dotenv from 'dotenv';
dotenv.config();
const otpStore = new Map();
const router = express.Router();

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });

    try {
        await sendOtpEmail(email, otp);
        res.json({ message: 'OTP sent to your email' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to Send Otp" });
    }
}); 

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore.get(email);

    if (!record || record.otp != otp || Date.now() > record.expiresAt) {
        return res.status(400).json({ error: "Invalid or expired otp" });
    }

    otpStore.set(email, { ...record, verified: true });
    res.json({ message: "OTP verified" });
});


router.post('/register', async (req, res) => {
    const { email, password, phone, name } = req.body;

    if (!email || !password || !phone || !name) {
        return res.status(400).json({ message: "email or password can not be empty" });
    }
    
    // Check OTP before registering
    const otpRecord = otpStore.get(email);
    if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: 'Please verify your email via OTP first' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    try {

        // if(user){console.log("User Already Registered!")};
        const existingUser = await pool.query("SELECT * FROM users WHERE email =($1)", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: "User already resgistered" });
        }

        // Creating a New User in the DataBase
        const newUser = await pool.query("INSERT INTO users (email, password, phone, name) VALUES($1, $2, $3, $4) RETURNING id", [email, hashedPassword, phone, name]);
        
        otpStore.delete(email);

        // Creating A jWT token 
        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.log("Registration Failed:", error.message);
        res.status(503).json({ error: "User Registration Failed" });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "email or password can not be empty" });
    }

    try {
        const result = await pool.query("SELECT *FROM users WHERE email=($1)", [email]);

        // if we cannot find a user associated with that email, return out from the function
        if (result.rows.length === 0) { return res.status(404).send({ message: "User not found" }) };

        const user = result.rows[0];

        const isValidUser = await bcrypt.compare(password, user.password);

        if (!isValidUser) { return res.status(401).send({ message: "wrong password" }) };

        // then we have a successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });

    } catch (error) {
        console.log("Login failed:", error.message);
        res.status(500).json({ error: "Login failed due to server error" });
    }
});


export default router;