import Mail from "../../lib/Mail.js";

class WelcomeEmailJob {
    get key() {
        return "WelcomeEmail";
    }

    async handle({ data }) {
        try {
            const { name, email } = data;

            await Mail.send({
                to: email,
                subject: "Bem-vindo(a)",
                text: `Olá ${name}, bem vindo ao nosso sistema.`,
            });

            console.log("📧 Email enviado para:", email);
        } catch (err) {
            console.error("❌ Erro ao enviar email:", err);
        }
    }

}

export default new WelcomeEmailJob();