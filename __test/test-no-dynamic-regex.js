import 'dotenv/config';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 } from '@google-cloud/translate';
import cheerio from 'cheerio';
const { Translate } = v2;
const translateApi = new Translate({key: process.env.GOOGLE_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const examples = JSON.parse(fs.readFileSync(path.join(__dirname, 'examples.json')));

// /{{\s*([\w]*)\s*}}(?!\\|\")/gm
//const str = "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>";

const translateObj = async (obj) => {
    // console.log(obj);
    await Promise.all(Object.entries(obj).map(async ([key, val]) => {
        const interpolatedStr = val.replace(/(?<!\=\\|\"){{\s*([\w]*)\s*}}(?!\\|\")/gm, (m, p) => {
            return `<tt traslate-key="${p}">${p}</tt>`;
        });
        
        const [translation] = await translateApi.translate(interpolatedStr, 'ru');
        const $ = cheerio.load(translation, {
            decodeEntities: true
        }, false);
        
        $('tt').each((_, item) => {
            $(item).replaceWith(`{{ ${$(item).attr('traslate-key')} }}`)
        })

        obj[key] = $.html();
    }));
    console.log(obj);
}

const translateStr = async (str) => {
    const interpolatedStr = str.replace(/(?<!\=\\|\"){{\s*([\w]*)\s*}}(?!\\|\")/gm, (m, p) => {
        return `<tt traslate-key="${p}">${p}</tt>`;
    });
    
    const [translation] = await translateApi.translate(interpolatedStr, 'ru');
    const $ = cheerio.load(translation, {
        decodeEntities: true
    }, false);
    
    $('tt').each((_, item) => {
        $(item).replaceWith(`{{ ${$(item).attr('traslate-key')} }}`)
    })

    return $.html();
}

const parseKeys = (obj, arr=[]) => {
    Object.keys(obj).map((key) => {
        const value = obj[key];
        if (typeof value === 'object') {
            arr.push(key);
            parseKeys(value, arr);
        }
        if (typeof value === 'string') {
            arr.push(key);
        }
    });
    return arr;
}

const composeMap = (data, mapPath = '', map) => {
    if(typeof data === 'string') {
      map[mapPath] = data;
    return;
  }
  Object.entries(data).map(([k, v]) => {
        composeMap(v, mapPath ? (mapPath + '.' + k) : k, map);
  })
  }
 
const withMap = (data) => {
    const map = {};
    composeMap(data, '', map);
    return map;
}

const compareKeys = (source, locale) => {
    const diff = {};
    Object.entries(source).map(([key, val]) => {
        if (!Object.keys(locale).includes(key)) {
            diff[key] = val;
        }
    }); 
    return diff;
}

const update = (steps, locale, tmpl) => {
    const step = steps.shift();

    if(tmpl[step] && typeof tmpl[step] === 'string' && typeof locale[step] === 'string') {
        tmpl[step] = locale[step];
        return;
    }

    if (typeof tmpl[step] === 'object' && typeof locale[step] === 'object') {
        update(steps, locale[step], tmpl[step]);
    }
}

const updateLocalesKeys = (keyMap, locale, source) => {
    const newObject = JSON.parse(JSON.stringify(source));
    Object.keys(keyMap).map(key => {
        const steps = key.split('.');
        update(steps, locale, newObject);
    });
    return newObject;
}

const source = JSON.parse(fs.readFileSync(path.join(__dirname, 'en.json')));
const locale = JSON.parse(fs.readFileSync(path.join(__dirname, 'ru.json')));

const map = withMap(source);

const updatedLocaleObject = updateLocalesKeys(map, locale, source);

const keysArrLocale = parseKeys(locale);
const keysArrSource = parseKeys(source);
const keysArrUpdated = parseKeys(updatedLocaleObject);            

const diff = compareKeys(withMap(source), withMap(locale));
console.log(diff);
if (keysArrLocale.length === keysArrSource.length) {
    console.log('Success +++ ', keysArrLocale.length, 'from', keysArrSource.length);
} else {
    console.log('False --- ', keysArrLocale.length, 'from', keysArrSource.length);
}

const checkDiff = compareKeys(withMap(source), withMap(updatedLocaleObject));

if (keysArrUpdated.length === keysArrSource.length) {
    console.log('Success +++ ', keysArrUpdated.length, 'from', keysArrSource.length, checkDiff);
} else {
    console.log('False --- ', keysArrUpdated.length, 'from', keysArrSource.length, checkDiff);
}


const translatedObj = await translateObj(diff, updatedLocaleObject)


fs.writeFileSync(path.join(__dirname, 'updated-ru.json'), JSON.stringify(translatedObj, null, '\t'));

translateObj(examples);
//console.log($.html());