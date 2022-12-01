// import { interpolate } from "../not_test/test-no-dynamic-regex.js";
const { interpolate } = require("../not_test/testik.js");
// import {jest} from '@jest/globals';
// console.log('i am testik');
const inStrings = ["{{ value }}"];
const outStrings = ['<tt traslate-key="value">value</tt>'];
// console.log(interpolate(inStrings[0])); 


test('Test interpolation', () => {
    expect(interpolate(inStrings[0])).toBe(outStrings[0])
})