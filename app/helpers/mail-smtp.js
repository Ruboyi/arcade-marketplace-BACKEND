"use strict";
const nodemailer = require("nodemailer");
const { HTTP_SERVER_DOMAIN, SMTP_PORT, SMTP_HOST, SMTP_USER, SMTP_PASS } =
  process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendMailRegister(name, email, code) {
  const linkActivation = `http://localhost:3000/api/v1/users/activation?code=${code}`;

  const mailData = {
    from: SMTP_USER,
    to: email,
    subject: "Welcome to Arcade Marketplace",
    text: `Hi ${name}, to confirm the account go this link: ${linkActivation}`,
    html: `Hi ${name}, to confirm the account <a href='${linkActivation}'>active it here</a>`,
  };

  const data = await transporter.sendMail(mailData);

  return data;
}
async function sendMailCorrectValidation(name, email) {
  const mailData = {
    from: SMTP_USER,
    to: email,
    subject: "Arcade Marketplace - Account activated!",
    text: `Hi ${name},\n your account was activated.`,
    html: `<h1>Hi ${name},</h1> your account was activated.`,
  };

  const data = await transporter.sendMail(mailData);

  return data;
}

module.exports = {
  sendMailCorrectValidation,
  sendMailRegister,
};
