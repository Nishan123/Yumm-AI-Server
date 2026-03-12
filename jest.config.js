module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/api"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "api/**/*.ts",
    "!api/**/*.d.ts",
    "!api/index.ts",
    "!api/app.ts",
    "!api/__tests__/**",
    "!api/routes/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/api/__tests__/setup.ts"],
  moduleNameMapper: {
    "^uuid$": "<rootDir>/api/__tests__/__mocks__/uuid.js",
  },
};
