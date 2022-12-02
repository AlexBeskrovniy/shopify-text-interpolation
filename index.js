const fs = require('fs');
const path = require('path');
const {Translate} = require('@google-cloud/translate').v2;
const cheerio = require('cheerio');

const { interpolate } = require('./helpers.js')

const translateApi = new Translate({key: process.env.GOOGLE_API_KEY });



const translateStr = async (str) => {
    const interpolatedStr = interpolate(str);
    // console.log(interpolatedStr);
    return
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

const translateUpdatedKeys = async (keyMap, updatedObj) => {
    const translateBySteps = async (steps, obj) => {
        const step = steps.shift();
        if (typeof obj[step] === 'string') {
            obj[step] = await translateStr(obj[step]);
            return;
        }
        if (typeof obj[step] === 'object') {
            await translateBySteps(steps, obj[step]);
        }
    }

    await Promise.all(Object.keys(keyMap).map(async (key) => {
        const steps = key.split('.');
        await translateBySteps(steps, updatedObj);
    }));

    return updatedObj;
}

const start = async () => {
    const source = JSON.parse(fs.readFileSync(path.join(__dirname, './templates/in/en.json')));
    const locale = JSON.parse(fs.readFileSync(path.join(__dirname, './templates/in/ru.json')));

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

    const translatedLocaleObject = await translateUpdatedKeys(diff, updatedLocaleObject);


    fs.writeFileSync(path.join(__dirname, './templates/out/updated-ru.json'), JSON.stringify(translatedLocaleObject, null, '\t'));
}

start()