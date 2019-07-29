import { configure } from '@storybook/react'

function loadStories() {
    // require(resolve(__dirname, '..', 'src', 'index.tsx'))
    require('../src/index.tsx')
}

configure(loadStories, module);
