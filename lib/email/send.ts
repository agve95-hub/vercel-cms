import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }): Promise<boolean> => {
  if (!process.env.SMTP_HOST) return false;
  try {
    const t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT)||587, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    await t.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, html });
    return true;
  } catch { return false; }
};
