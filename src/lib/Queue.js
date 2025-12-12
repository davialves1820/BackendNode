import Bee from "bee-queue";
import DummyJob from "../app/jobs/DummyJob.js";
import WelcomeEmailJob from "../app/jobs/WelcomeEmailJob.js";

const jobs = [DummyJob, WelcomeEmailJob];

class Queue {
    constructor() {
        this.queues = {};
        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: {
                        host: "localhost",
                        port: 6379,
                    }
                }),
                handle,
            };
        });
    }

    add(queue, jobs) {
        return this.queues[queue].bee.createJob(jobs).save();
    }

    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];
            bee.on("failed", this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err) {
        console.error(`Queue ${job.key} failed:`, err);
    }
}

export default new Queue();
