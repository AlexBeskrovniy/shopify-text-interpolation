const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const interpolate = (str) => {
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
};

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

const compareObjectsMaps = (sourceMap, targetMap) => {
    return Object.entries(sourceMap).reduce((acc, [keyMap, val]) => {
        if (!Object.keys(targetMap).includes(keyMap)) {
            acc[keyMap] = val;
        }
        return acc;
    }, {})
}

//For test environment only
const parseJSONFile = (localePath) => { // NOTE: what if empty or doesn't exist?
    return JSON.parse(fs.readFileSync(path.join(__dirname, localePath)))
}
//For test environment only

module.exports = { 
    interpolate,
    deinterpolate,
    getObjKeysArray,
    parseJSONFile,
    getValuesMap,
    compareObjectsMaps
}