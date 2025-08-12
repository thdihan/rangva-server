import nodemailer from "nodemailer";
import config from "../config";

export const emailSender = async (receiverEmail: string, html: string) => {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.email.sender,
            pass: config.email.app_pass,
        },
    });

    const info = await transporter.sendMail({
        from: '"Health Connect Team" <tanvirh.dihan@gmail.com>',
        to: receiverEmail,
        subject: "Reset password link.",
        // text: "Hello world?", // plain‑text body
        html, // HTML body
    });

    console.log("Message sent:", info.messageId);
};
