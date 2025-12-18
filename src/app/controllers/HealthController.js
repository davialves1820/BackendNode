import Database from "../../database/index.js";
import Queue from "../../lib/Queue.js";

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Monitoramento da aplicação
 */


class HealthController {

    /**
     * @swagger
     * /health:
     *   get:
     *     summary: Retorna o status da aplicação e serviços
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Todos os serviços operacionais
     *       503:
     *         description: Algum serviço indisponível
     */

    async index(req, res) {
        const health = {
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            services: {
                api: "up",
                database: "down",
                redis: "down",
            },
        };

        // ✅ Banco de dados (Sequelize)
        try {
            await Database.connection.authenticate();
            health.services.database = "up";
        } catch (err) {
            health.status = "error";
            health.services.database = "down";
        }

        // ✅ Redis (Bee Queue)
        try {
            const redisUp = await Queue.isRedisUp();

            health.services.redis = redisUp ? "up" : "down";

            if (!redisUp) {
                health.status = "error";
            }
        } catch (err) {
            console.log(err)
            health.status = "error";
            health.services.redis = "down";
        }

        return res
            .status(health.status === "ok" ? 200 : 503)
            .json(health);
    }
}

export default new HealthController();
