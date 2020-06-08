/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
module.exports.globalConfig = {
    collectCoverageFrom: [
        "**/*.{js,ts,tsx}",
        "!**/testsuite/**",
        "!**/*.d.ts",
        "!**/*.spec.{ts,tsx}",
        "!**/tools/**/*.{ts,tsx}",
        "!**/spec/**/*.{ts,tsx}",
        "!**/node_modules/**",
        "**/node_modules/@sepraisal/**",
    ],
    coverageDirectory: "coverage",
    coverageReporters: [
        "text",
        "text-summary",
        // "json",
        "lcov",
        // "clover",
    ],
}

// `process.cwd()` is relative to script that does `require(...)`. Works for package.json scripts too.
module.exports.getPojectConfig = (projectPath = process.cwd()) => ({
    preset: "ts-jest",
    rootDir: process.cwd(),
    roots: [`${projectPath}/spec`],
    setupFilesAfterEnv: [`${projectPath === process.cwd() ? '../..' : '.'}/jest-setup.ts`],
    testEnvironment: "node",
    testRunner: "jest-circus/runner",

    globals: { JEST_PROJECT_PATH: process.cwd() },
});
