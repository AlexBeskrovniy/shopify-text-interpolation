import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translateTextTo } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const regBefore = /{{\s*([\S]*)\s*}}/gm;
const regAfter = /\<t\>\{([\S]*)\}\<\/t\>/gm;

const examples = JSON.parse(fs.readFileSync(path.join(__dirname, 'examples.json')));


Object.entries(examples).map(([key, val]) => {
    examples[key] = val.replace(regBefore, (match, p) => { return `<t>{${p}}</t>` });
});

//console.log(examples);

const translateObj = async (obj) => {
    await Promise.all(Object.entries(obj).map(async ([key, val]) => {
        const translate = await translateTextTo(val, 'ru');
        obj[key] = translate.replace(regAfter, (match, p) => { return `{{ ${p} }}` });
    }));
    console.log(obj);
}

//translateObj(examples);