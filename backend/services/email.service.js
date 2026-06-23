const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const isConfigured = () =>
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

const sendMail = async ({ to, subject, html }) => {
  if (!isConfigured()) {
    logger.warn(`Email not sent (SMTP not configured): ${subject} → ${to}`);
    return;
  }
  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM || `"${process.env.STORE_NAME || "Showoff"}" <noreply@showoff.com>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent: "${subject}" → ${to}`);
  } catch (err) {
    logger.error(`Email failed: ${err.message}`);
  }
};

module.exports = { sendMail };
