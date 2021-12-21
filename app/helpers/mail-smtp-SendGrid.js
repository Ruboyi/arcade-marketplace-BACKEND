'use strict';

const sgMail = require('@sendgrid/mail');
const createJsonError = require('../errors/create-json-error');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { HTTP_SERVER } = process.env;

async function sendMailRegister(name, email, code) {
  try {
    const linkActivation = `${HTTP_SERVER}/api/v1/users/activation?code=${code}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: 'Welcome to Arcade Marketplace',
      text: `Hi ${name}, to confirm the account go this link: ${linkActivation}`,
      html: `<div>
               Hi ${name}, to confirm the account <a href='${linkActivation}'>active it here</a>
             </div>`,
    };

    const data = await sgMail.send(msg);

    return data;
  } catch (error) {
    createJsonError(400, 'Error al enviar el mail');
  }
}

async function sendMailCorrectValidation(name, email) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: 'Arcade Marketplace - Account Activated!',
    text: `Hi ${name}, \n Your account was activated.`,
    html: `<h1>Hi ${name},</h1> your account was activated.`,
  };

  const data = await sgMail.send(msg);
  return data;
}

module.exports = {
  sendMailRegister,
  sendMailCorrectValidation,
};
