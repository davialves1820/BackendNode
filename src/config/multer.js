import multer from "multer";
import crypto from "crypto";
import { extname, resolve } from "path";

export default {
    storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "tmp", "uploads"),

    filename: (req, file, callback) => {
        crypto.randomBytes(16, (err, buffer) => {
        if (err) {
            return callback(err);
        }

        return callback(
            null,
            buffer.toString("hex") + extname(file.originalname)
        );
    });
    },
    }),
};
