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

//const examples = JSON.parse(fs.readFileSync(path.join(__dirname, 'examples.json')));

// /{{\s*([\w]*)\s*}}(?!\\|\")/gm
//const str = "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>";

// const translateObj = async (obj) => {
//     // console.log(obj);
//     await Promise.all(Object.entries(obj).map(async ([key, val]) => {
//         const interpolatedStr = val.replace(/(?<!\=\\|\"){{\s*([\w]*)\s*}}(?!\\|\")/gm, (m, p) => {
//             return `<tt traslate-key="${p}">${p}</tt>`;
//         });
        
//         const [translation] = await translateApi.translate(interpolatedStr, 'ru');
//         const $ = cheerio.load(translation, {
//             decodeEntities: true
//         }, false);
        
//         $('tt').each((_, item) => {
//             $(item).replaceWith(`{{ ${$(item).attr('traslate-key')} }}`)
//         })

//         obj[key] = $.html();
//     }));
//     console.log(obj);
// }