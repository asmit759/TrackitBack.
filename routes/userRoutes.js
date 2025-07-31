import express from  'express';
import dotenv from 'dotenv';
import pool from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

dotenv.config();

//get every details of a user
router.get('/',authMiddleware, async(req, res) => {
    try {
        const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [ req.userId]);

        if(user.rows.length === 0){
            return res.status(404).json({error: "User not found"});
        }
        res.send(user.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Failed to retrieve user data"});
    }
});

export default router;