import Database from "../../database/index.js";
import Queue from "../../lib/Queue.js";

class HealthController {
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
            const queues = Object.values(Queue.queues);

            if (!queues.length) {
                throw new Error("No queues initialized");
            }

            // Bee Queue expõe o client do Redis
            const redisClient = queues[0].bee.client;
            await redisClient.ping();

            health.services.redis = "up";
        } catch (err) {
            health.status = "error";
            health.services.redis = "down";
        }

        return res
            .status(health.status === "ok" ? 200 : 503)
            .json(health);
    }
}

export default new HealthController();
