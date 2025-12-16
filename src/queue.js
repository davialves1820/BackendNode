import Queue from "./lib/Queue.js";

Queue.processQueue();

process.on("SIGINT", async () => {
    console.log("🛑 Shutting down queues...");
    await Queue.shutdown();
    process.exit(0);
});
