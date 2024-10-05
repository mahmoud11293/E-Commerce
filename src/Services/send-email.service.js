import nodemailer from "nodemailer";

export const sendEmailService = async ({
  to = "",
  subject = "",
  htmlMessage = "",
} = {}) => {
  // transporter configration
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
      user: "m.shehata11293@gmail.com",
      pass: "xfjbobrcyrofjzgo",
    },
  });

  // message configration
  const info = await transporter.sendMail({
    from: '"No-Reply" <m.shehata11293@gmail.com>',
    to,
    subject,
    html: htmlMessage,
  });
  return info;
};
