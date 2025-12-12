import multer from "multer";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname, extname, resolve } from "path";

// Ajuste para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", "tmp", "uploads"),

        filename: (req, file, callback) => {
            crypto.randomBytes(16, (err, buffer) => {
                if (err) {
                    return callback(err);
                }

                const filename = buffer.toString("hex") + extname(file.originalname);
                return callback(null, filename);
            });
        },
    }),
};
