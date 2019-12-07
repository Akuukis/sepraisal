const { globalConfig, getPojectConfig } = require('../../jest.common')

module.exports = {
    ...globalConfig,
    ...getPojectConfig(),
};
