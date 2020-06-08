/* eslint-env commonjs */
/* eslint-disable @typescript-eslint/no-var-requires */
const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");
const { globalConfig, getPojectConfig } = require('./jest.common')

const isDirectory = (source) => lstatSync(source).isDirectory();
const getDirectories = (source) => readdirSync(source)
    .map((name) => join(source, name))
    .filter(isDirectory)
    .filter((path) => {try{return isDirectory(join(path, 'spec'))} catch(err){return false}});

module.exports = {
    ...globalConfig,
    projects: getDirectories("workspaces").map(getPojectConfig),
};
