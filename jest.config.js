/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
};
