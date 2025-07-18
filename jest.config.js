/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  // Jest running with imported vitest utils causes errors like:
  // Vitest cannot be imported in a CommonJS module using require(). Please use "import" instead.
  modulePathIgnorePatterns: ["<rootDir>/src/util/tailwindcss-api/worker/"],
};
