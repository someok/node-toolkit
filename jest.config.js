// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./jest.config.base');

module.exports = {
    ...baseConfig,

    // Run tests from one or more projects
    projects: ['<rootDir>/packages/*'],
    roots: ['<rootDir>/packages'],
};
