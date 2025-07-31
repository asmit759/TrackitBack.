import express from 'express';
import pool from '../db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

router.post('/sendClaimMail', authMiddleware, async (req, res) => {
    const claimerId = req.userId;
    const { id } = req.body;

    if (!claimerId || !id) {
        return res.status(400).json({ error: 'Missing claimer ID or item ID' });
    }

    try {
        const result = await pool.query(`
            SELECT 
              items.title,
              owner.email AS owner_email,
              claimer.email AS claimer_email,
              claimer.phone AS claimer_phone,
              claimer.name AS claimer_name
            FROM items
            JOIN users AS owner ON items.user_id = owner.id
            JOIN users AS claimer ON claimer.id = $1
            WHERE items.id = $2
        `, [claimerId, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Item or users not found' });
        }

        const { title, owner_email, claimer_email,claimer_phone,claimer_name } = result.rows[0];

        if(owner_email===claimer_email){
            return res.status(400).json({error:'Owner And Claimer can not be same'});
        }

        const transporter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: owner_email,
            subject: `Claim Request for "${title}"`,
            html: `
                        <p>Dear User,</p>

                        <p>
                        We are writing to inform you that your listed item, <strong>${title}</strong>, has been claimed by an interested party. Below are the details of the individual who has claimed your item:
                        </p>

                        <ul>
                        <li><strong>Name:</strong> ${claimer_name}</li>
                        <li><strong>Email:</strong> ${claimer_email}</li>
                        <li><strong>Phone Number:</strong> ${claimer_phone}</li>
                        </ul>

                        <p>
                        Please contact the claimant directly to verify their claim and arrange for the return of your item. If you have any concerns or require further assistance, feel free to reach out to our support team.
                        </p>

                        <br/>

                        <p>
                        Thank you for using the Trackit Back.
                        </p>

                        <p>
                        Best regards,<br/>
                        <i>Trackit Back Team</i>
                        </p>

            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Claim email sent successfully',
            owner_email,
            claimer_email
        });

    } catch (err) {
        console.error('❌ Error sending email:', err.message);
        res.status(500).json({ error: 'Failed to send claim email' });
    }
});

export default router;
