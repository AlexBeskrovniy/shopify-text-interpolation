const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

//Backup regexp (?<!\=\\|\"){{\s*([\w]*)\s*}}(?!\\|\")   (?<!\=\"){{\s*([\w]*)\s*}}
const interpolate = (str) => { //NOTE: has bug
    return str.replace(/(?<!\=\"){{\s*([\w]*)\s*}}/gm, (m, p) => {
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

const getObjKeysArray = (obj, acc=[]) => { //NOTE: add recursion exit
    Object.keys(obj).map((key) => {
        const value = obj[key];
        if (typeof value === 'object') {
            acc.push(key);
            getObjKeysArray(value, acc);
        }
        if (typeof value === 'string') {
            acc.push(key);
        }
    });
    return acc;
}

const parseJSONFile = (localePath) => { // NOTE: what if empty or doesn't exist?
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

const compareObjectsByKeys = (sourceMap, targetMap) => { //NOTE: compareObjectsByKeys -> compareObjectMaps ?
    return Object.entries(sourceMap).reduce((acc, [keyMap, val]) => {
        if (!Object.keys(targetMap).includes(keyMap)) {
            acc[keyMap] = val;
        }
        return acc;
    }, {})
}

module.exports = { 
    interpolate,
    deinterpolate,
    getObjKeysArray,
    parseJSONFile,
    getValuesMap,
    compareObjectsByKeys
}