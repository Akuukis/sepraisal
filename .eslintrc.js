module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    // parserOptions: {
    //     sourceType: 'module',
    //     tsconfigRootDir: __dirname,
    //     project: [
    //         // './tsconfig.json',
    //         './workspaces/*/tsconfig.json',
    //     ],
    // },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules: {
    }
};
