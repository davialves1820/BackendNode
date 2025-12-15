jest.mock("./src/config/multer.js", () => ({
    __esModule: true,
    default: {
        storage: {
            _handleFile(req, file, cb) {
                cb(null, {
                    buffer: Buffer.from("fake"),
                    size: 4,
                });
            },
            _removeFile(req, file, cb) {
                cb(null);
            },
        },
    },
}));
