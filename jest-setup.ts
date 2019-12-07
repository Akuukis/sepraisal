import * as failFast from 'jasmine-fail-fast'

// https://github.com/facebook/jest/issues/2867#issuecomment-370624846
const args: string[] = typeof process.env.npm_config_argv === 'string'
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv

if (args.includes('--bail')) {
    const jasmineEnv = (jasmine as any).getEnv()
    jasmineEnv.addReporter(failFast.init())
}
