import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST, 
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.MY_EMAIL,       
    pass: process.env.MY_EMAIL_PASS,  
  },
});

// Function to send OTP via email
const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Track It Back" <${process.env.MY_EMAIL}>`,
    to, 
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    throw new Error('Failed to send OTP email. Please try again.');
  }
};

export default sendOtpEmail;
