/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { globalConfig, getPojectConfig } = require('../../jest.common')

module.exports = {
    ...globalConfig,
    ...getPojectConfig(),
};
