import Bee from "bee-queue";
import DummyJob from "../app/jobs/DummyJob.js";
import WelcomeEmailJob from "../app/jobs/WelcomeEmailJob.js";

const jobs = [DummyJob, WelcomeEmailJob];

class Queue {
    constructor() {
        this.queues = {};
        this.initialized = false;
        this.processing = false;
    }

    init() {
        if (this.initialized) return;

        jobs.forEach(job => {
            const bee = new Bee(job.key, {
                redis: {
                    host: process.env.REDIS_HOST,
                    port: Number(process.env.REDIS_PORT),
                },
            });

            this.queues[job.key] = {
                bee,
                job,
            };
        });

        this.initialized = true;
    }


    processQueue() {
        if (this.processing) return;
        this.processing = true;

        this.init();

        Object.values(this.queues).forEach(({ bee, job }) => {
            bee.process(job.handle.bind(job));

            bee.on("failed", (jobInstance, err) => {
                console.error(`❌ Queue ${job.key} failed:`, err);
            });
        });
    }

    add(queueKey, data) {
        this.init(); // GARANTE que a fila exista

        const queue = this.queues[queueKey];

        if (!queue) {
            throw new Error(`Queue ${queueKey} not found`);
        }

        return queue.bee.createJob(data).save();
    }

    async isRedisUp() {
        try {
            this.init();

            const queues = Object.values(this.queues);

            if (!queues.length) {
                return false;
            }

            // criação do client e testa conexão
            await queues[0].bee.ready();

            return true;
        } catch (err) {
            return false;
        }
    }


    async shutdown() {
        for (const { bee } of Object.values(this.queues)) {
            await bee.close();
        }
    }
}

export default new Queue();
