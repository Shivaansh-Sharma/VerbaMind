// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify().then(() => {
  console.log("✅ Nodemailer transporter is ready");
}).catch((err) => {
  console.error("❌ Nodemailer verification error:", err);
});

export async function sendSignupOtpEmail(toEmail, otp) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const html = `
    <p>Hi,</p>
    <p>Your VerbaMind signup verification code is:</p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
    <p>This code will expire in 10 minutes.</p>
  `;

  await transporter.sendMail({
    from,
    to: toEmail,
    subject: "Your VerbaMind signup OTP",
    text: `Your VerbaMind signup verification code is ${otp}. It expires in 10 minutes.`,
    html,
  });
}
