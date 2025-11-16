// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Use the same Gmail-style config you used in the old project
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password, NOT normal password
  },
});

// Optional: only verify in development to avoid slowing down prod boot
if (process.env.NODE_ENV !== "production") {
  transporter
    .verify()
    .then(() => {
      console.log("✅ Nodemailer Gmail transporter is ready");
    })
    .catch((err) => {
      console.error("❌ Nodemailer verification error (dev):", err);
    });
}

export async function sendSignupOtpEmail(toEmail, otp) {
  const from =
    process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@example.com";

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
