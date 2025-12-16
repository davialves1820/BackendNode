class DummyJob {
    get key() {
        return "dummy";
    }

    get options() {
        return {
            removeOnSuccess: true,
        };
    }

    async handle({ data }) {
        const { message } = data;

        if (!message) {
            throw new Error("Message is required");
        }

        console.log(`🧪 DummyJob: ${message}`);
    }
}

export default new DummyJob();
