import File from "../models/File";

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
     */
    async create(req, res) {
        const { originalname: name, filename: path } = req.file;

        const file = await File.create({ name, path });

        res.status(200).json(file);
    }
}

export default new FilesController();