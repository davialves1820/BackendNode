export default {
    testEnvironment: "node",

    globalSetup: "<rootDir>/tests/setup.js",
    globalTeardown: "<rootDir>/tests/teardown.js",

    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

    transform: {},

    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};
