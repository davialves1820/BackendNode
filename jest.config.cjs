module.exports = {
    testEnvironment: "node",

    extensionsToTreatAsEsm: [".js"],

    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },

    globalSetup: "<rootDir>/tests/setup.js",
    globalTeardown: "<rootDir>/tests/teardown.js",

    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
