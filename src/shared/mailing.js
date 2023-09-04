import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 594,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_KEY,
  },
});

export const sendMail = async (ticket) => {
  const mail = {
    from: "carolinagallo@gmail.com",
    to: ticket.purchaser,
    subject: "ticket",
    html: `<div><h5>ticket</h5></div>`,
    attachments: [],
  };
  await transport.sendMail(mail);
};
