#!/usr/bin/env -S deno -q run
// deno-language: ts
import pako from 'pako'
import * as asdf from '@sepraisal/praisal'

const test = { my: 'super', puper: [456, 567], awesome: 'pako' };

const compressed = pako.deflate(JSON.stringify(test));

const result = pako.inflate(compressed, { to: 'string' })
if(result) {
    const restored = JSON.parse(result.toString());
    console.log(compressed, restored)
}
