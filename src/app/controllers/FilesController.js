import File from "../models/File.js";

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: Upload de arquivos
 */

class FilesController {
    /**
     * @swagger
     * /file:
     *   post:
     *     summary: Upload de arquivo
     *     tags: [Files]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Upload bem-sucedido
     *       500:
     *         description: Error ao fazer o upload
     */
    async create(req, res) {
        try {
            const { originalname: name, filename: path } = req.file;

            const file = await File.create({ name, path });

            res.status(200).json(file);
        } catch (error) {
            return res.status(500).json({
                error: err?.message,
                original: err?.original,
            });
        }
    }
}

export default new FilesController();