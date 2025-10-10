import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (mailOptions) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://www.youtube.com/@tasincoder",
    },
  });

  const emailBody = {
    body: {
      name: mailOptions.name,
      intro:
        "Welcome to Task Manager! We're very excited to have you on board.",
      action: {
        instructions: mailOptions.instructions,
        button: {
          color: "#22BC66",
          text: mailOptions.text,
          link: mailOptions.url,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const emailHtml = mailGenerator.generate(emailBody);
  const emailText = mailGenerator.generatePlaintext(emailBody);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mail = {
    from: process.env.MAILTRAP_FROM,
    to: mailOptions.email,
    subject: mailOptions.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email Sending fail Error :-", error);
  }
};

export { sendMail };

// const data = {
//   email: "",
//   subject: "",
//   url: "",
//   instructions: "",
//   name: "",
//   text: "",
// };
