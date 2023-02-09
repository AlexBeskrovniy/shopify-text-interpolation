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


const optimizeSource = (keyMap, locale, source, exeptionsMap) => {  
    return Object.keys(keyMap).reduce((acc, keyPath) => {
        if (exeptionsMap[keyPath]) return acc;
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


const getNewKeysByMap = (sourceMap, targetMap) => {
    return Object.entries(sourceMap).reduce((acc, [keyMap, val]) => {
        if (!Object.keys(targetMap).includes(keyMap)) {
            acc[keyMap] = val;
        }
        return acc;
    }, {})
}


const translateByMap = async (valuesMap, obj, lang, exeptions) => {
    await Promise.all(Object.keys(valuesMap).map(async (key) => {
        const steps = key.split('.');
        await translateBySteps(steps, obj, lang, exeptions);
    }));
    return obj;
}
const translateBySteps = async (steps, obj, lang, exeptions) => {
    const step = steps.shift();
    if (typeof obj[step] === 'string') {
        const translatable = new Promise((res) => {
            setTimeout(() => res(translateStr(obj[step], lang, exeptions)), 200)
        })
        obj[step] = await translatable;
        return;
    }
    if (typeof obj[step] === 'object') {
        await translateBySteps(steps, obj[step], lang, exeptions);
    }
}
const translateStr = async (str, lang, exeptions) => {
    const interpolatedStr = interpolateExeptions(interpolate(str), exeptions);
    const [translation] = await translateApi.translate(interpolatedStr, lang);
    return deinterpolateExeptions(deinterpolate(translation));
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

const interpolateExeptions = (str, exeptions) => {
    const match = exeptions.find(el => str.includes(el));
    return str.replace(match, `<span no-translate="${match}">${match}</span>`);
}

const deinterpolateExeptions = (str) => {
    const $ = cheerio.load(str, {
        decodeEntities: true
    }, false);
    
    $('[no-translate]').each((_, item) => {
        $(item).replaceWith($(item).attr('no-translate'));
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

const getChangedValuesByMap = (newMap, oldMap) => {
    return Object.entries(newMap).reduce((acc, [keyMap, changedValue]) => {
        if (oldMap[keyMap] && oldMap[keyMap] !== changedValue)
        acc[keyMap] = changedValue
        return acc
    }, {})
} 

module.exports = {
    readAndParseJSON,
    getValuesMap,
    optimizeSource,
    getNewKeysByMap,
    translateByMap,
    getObjKeysArray,
    deinterpolate,
    interpolate,
    interpolateExeptions,
    deinterpolateExeptions,
    translateStr,
    getChangedValuesByMap
}