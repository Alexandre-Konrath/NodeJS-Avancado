import nodemailer from "nodemailer";
import mailConfig from "../config/mail";

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.trasnporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  // enviar a mensagem
  send(message) {
    return this.trasnporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
