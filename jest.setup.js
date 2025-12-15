import { jest } from "@jest/globals";

jest.mock("./src/config/multer.js", () => ({
    __esModule: true,
    default: {
        storage: {
            _handleFile: jest.fn(),
            _removeFile: jest.fn(),
        },
    },
}));
