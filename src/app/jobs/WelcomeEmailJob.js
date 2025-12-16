import Mail from "../../lib/Mail.js";

class WelcomeEmailJob {
    get key() {
        return "WelcomeEmail";
    }

    get options() {
        return {
            attempts: 3,
            backoff: {
                type: "fixed",
                delay: 5000, // 5s
            },
            timeout: 10000, // 10s
            removeOnSuccess: true,
            removeOnFailure: false,
        };
    }

    async handle({ data }) {
        const { name, email } = data;

        if (!email || !name) {
            throw new Error("Missing email or name");
        }

        await Mail.send({
            to: email,
            subject: "Bem-vindo(a)",
            text: `Olá ${name}, bem vindo ao nosso sistema.`,
        });

        console.log(`📧 Welcome email sent to ${email}`);
    }
}

export default new WelcomeEmailJob();
