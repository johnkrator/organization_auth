module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.spec.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
