const cheerio = require('cheerio');


//Backup regexp (?<!\=\\|\"){{\s*([\w]*)\s*}}(?!\\|\")   (?<!\=\"){{\s*([\w]*)\s*}}
const interpolate = (str) => { //NOTE: has bug
    return str.replace(/(?<!\=\"){{\s*([\w]*)\s*}}/gm, (m, p) => {
        return `<tt traslate-key="${p}">${p}</tt>`;
    });
}

const deinterpolate = (str) => {
    const $ = cheerio.load(str, {
        decodeEntities: true
    }, false);
    
    $('tt').each((_, item) => {
        $(item).replaceWith(`{{ ${$(item).attr('traslate-key')} }}`)
    })

    return $.html();
}

const getObjKeysArray = (obj, arr=[]) => {
    Object.keys(obj).map((key) => {
        const value = obj[key];
        if (typeof value === 'object') {
            arr.push(key);
            getObjKeysArray(value, arr);
        }
        if (typeof value === 'string') {
            arr.push(key);
        }
    });
    return arr;
}

const parseJSONFile = (localePath) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, localePath)))
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
 
const getValuesMap = (data) => {
    const map = {};
    composeMap(data, '', map);
    return map;
}

const compareObjectsByKeys = (source, target) => {
    const diff = {};
    Object.entries(source).map(([key, val]) => {
        if (!Object.keys(target).includes(key)) {
            diff[key] = val;
        }
    }); 
    return diff;
}

module.exports = { 
    interpolate,
    deinterpolate,
    getObjKeysArray,
    parseJSONFile,
    getValuesMap,
    compareObjectsByKeys
}