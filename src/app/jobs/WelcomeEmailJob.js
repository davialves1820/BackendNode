import Mail from "../../lib/Mail.js";

class WelcomeEmailJobc {
    get key() {
        return "WelcomeEmail";
    }

    async handle({ data }) {
        const { name, email } = data;
        Mail.send({
            to: email,
            subject: "Bem-vindo(a)",
            text: `Olá ${name}, bem vindo ao nosso sistema.`,
        });
    }
}

export default new WelcomeEmailJobc();