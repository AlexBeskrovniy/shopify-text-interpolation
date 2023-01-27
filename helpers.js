const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const {Translate} = require('@google-cloud/translate').v2;
const translateApi = new Translate({key: process.env.GOOGLE_API_KEY });


const readAndParseJSON = (localePath) => { // NOTE: what if empty or doesn't exist?
    return JSON.parse(fs.readFileSync(path.join(__dirname, localePath)))
}


const getValuesMap = (obj, mapPath = '', mapAcc = {}) => {
    if(typeof obj === 'string') {
        mapAcc[mapPath] = obj;
        return mapAcc;
    }
    Object.entries(obj).map(([key, value]) => {
        getValuesMap(value, mapPath ? (mapPath + '.' + key) : key, mapAcc);
    })
    return mapAcc
}


const mergeObjectsValues = (keyMap, locale, source) => {  
    return Object.keys(keyMap).reduce((acc, keyPath) => {
        const steps = keyPath.split('.');
        return mergeBySteps(steps, locale, acc);
    }, JSON.parse(JSON.stringify(source)))
    
}
const mergeBySteps = (steps, locale, acc) => {
    const step = steps.shift();
    if(typeof acc[step] === 'string' && typeof locale[step] === 'string') {
        acc[step] = locale[step];
    }
    if (typeof acc[step] === 'object' && typeof locale[step] === 'object') {
        mergeBySteps(steps, locale[step], acc[step]);
    }
    return acc;
}


const compareObjectsMaps = (sourceMap, targetMap) => {
    return Object.entries(sourceMap).reduce((acc, [keyMap, val]) => {
        if (!Object.keys(targetMap).includes(keyMap)) {
            acc[keyMap] = val;
        }
        return acc;
    }, {})
}


const translateByMap = async (valuesMap, obj) => {
    await Promise.all(Object.keys(valuesMap).map(async (key) => {
        const steps = key.split('.');
        await translateBySteps(steps, obj);
    }));
    return obj;
}
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
const translateStr = async (str, lang) => {
    const interpolatedStr = interpolate(str);
    const [translation] = await translateApi.translate(interpolatedStr, lang);
    return deinterpolate(translation)
}
const interpolate = (str) => {
    return str.replace(/(?<!\=\"){{\s*([\w]*)\s*}}/gm, (_, p) => {
        return `<tt traslate-key="${p}">${p}</tt>`;
    });
}
const deinterpolate = (str) => {
    if (typeof str !== 'string') {
        throw `Deinterpolate must get string. Got ${typeof str} instead`
    }
    const $ = cheerio.load(str, {
        decodeEntities: true
    }, false);
    
    $('tt').each((_, item) => {
        $(item).replaceWith(`{{ ${$(item).attr('traslate-key')} }}`)
    })

    return $.html();
}


const getObjKeysArray = (obj, acc=[]) => {
    Object.keys(obj).map((key) => {
    	acc.push(key);
        if (typeof obj[key] === 'string') {
            return;
        } else if (typeof obj[key] === 'object') {
            getObjKeysArray(obj[key], acc);
        }
    });
    return acc;
}


module.exports = {
    readAndParseJSON,
    getValuesMap,
    mergeObjectsValues,
    compareObjectsMaps,
    translateByMap,
    getObjKeysArray,
    deinterpolate,
    interpolate,
    translateStr
}