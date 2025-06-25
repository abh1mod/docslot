import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config();

const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     
      pass: process.env.APP_PASS,          
    },
  });

  const info = await transporter.sendMail({
    from: 'DocSlot <abhisingh12112002@gmail.com>',
    to,                
    subject,             
    html,                
  });

  console.log('Email sent:', info.messageId);
};

export default sendMail;
