import dotenv from "dotenv";
dotenv.config();

export default {
    host: process.env.EMAIL_HOST,
    port: 2525,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    default: {
        from: "Sistema <naoresponda@exemplo.com>",
    }
}