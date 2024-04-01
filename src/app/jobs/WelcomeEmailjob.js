import Mail from "../../lib/Mail";

class WelcomeEmailjob {
  get key() {
    return "WelcomeEmail";
  }

  async handle({ data }) {
    const { email, name } = data;

    // enviar o email de boas vindas
    Mail.send({
      to: email,
      subject: "Bem-Vindo(a)",
      text: `Olá ${name}, Bem vindo(a) ao nosso sistema!!!`,
    });
  }
}

export default new WelcomeEmailjob();
