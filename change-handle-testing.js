const fs = require('fs');
const path = require('path');

const { exeptionsArr } = require('./exeptions.js');

const {
    readAndParseJSON,
    getValuesMap,
    optimizeSource,
    getNewKeysByMap,
    translateByMap,
    getChangedValuesByMap
} = require('./helpers.js')


const oldSource  = readAndParseJSON('./templates/in/en.json');
const newSource = readAndParseJSON('./templates/in/en_CHANGED.json');

const oldMap = getValuesMap(oldSource);
const newMap = getValuesMap(newSource);

const newValuesMap = getChangedValuesByMap(newMap, oldMap);
const newKeysMap = getNewKeysByMap(oldMap, newMap);

const diffsOnEn = Object.assign(newKeysMap, newValuesMap);  

const translateLocale = async (localeName) => {
    const locale = readAndParseJSON(`./templates/locales/${localeName}`);
    const localeMap = getValuesMap(locale);
    
    const diffsOnLocale = getNewKeysByMap(newMap, localeMap);
    const toTranslateMap = {...diffsOnLocale, ...diffsOnEn};
    console.log(toTranslateMap);
    const optimizedNewSource = optimizeSource(oldMap, locale, newSource, diffsOnEn);
    targetLang = localeName.split('.')[0];

    const translatedLocaleObject = await translateByMap(toTranslateMap, optimizedNewSource, targetLang, exeptionsArr);
    // fs.unlinkSync(path.join(__dirname, `./templates/out/${localeName}`));
    fs.writeFileSync(path.join(__dirname, `./templates/out/${localeName}`), JSON.stringify(translatedLocaleObject, null, '\t'));
}

const translateLocalesFiles = () => {
    fs.readdirSync('./templates/locales/')
        .filter(name => !name.includes('default'))
        .forEach(translateLocale);
}
translateLocalesFiles()
