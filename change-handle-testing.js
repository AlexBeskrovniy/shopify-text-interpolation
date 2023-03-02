const fs = require('fs');
const path = require('path');

const {
    readAndParseJSON,
    getValuesMap,
    getNewKeysByMap,
    getChangedValuesByMap
} = require('./helpers.js')
const { updateLocale } = require('./helpers.js')

//TEMP: use env
// const localesPath = './templates/locales/'; 
// const outPath = './templates/out/'; 
const localesPath = './test/TestTemplates/locales/'; 
const outPath = './test/TestTemplates/out/'; 
const oldSourcePath = './test/TestTemplates/in/en.json';
const newSourcePath = './test/TestTemplates/in/en_CHANGED.json';

const getSourceState = () => {
    const oldSource = readAndParseJSON(oldSourcePath);
    const newSource = readAndParseJSON(newSourcePath);

    const oldSourceMap = getValuesMap(oldSource);
    const newSourceMap = getValuesMap(newSource);
    
    const changedValues = getChangedValuesByMap(newSourceMap, oldSourceMap);
    const newKeysMap = getNewKeysByMap(oldSourceMap, newSourceMap);
    const diffsOnSources = Object.assign(newKeysMap, changedValues);
    
    return { newSource, oldSourceMap, newSourceMap, diffsOnSources };
}


const getLocaleJSON = (name) => readAndParseJSON(`${localesPath}${name}`);
const getLocaleNames = () => fs.readdirSync(localesPath).filter(name => !name.includes('default'));
const getLocaleLang = (name) => name.split('.')[0];

const rewriteLocaleFiles = (updatedLocales) => {
    updatedLocales.map(({ localeName, updatedLocaleObject }) => {
        const outFilePath = path.join(__dirname, `${outPath}${localeName}`);
        fs.existsSync(outFilePath) && fs.unlinkSync(outFilePath);
        fs.writeFileSync(outFilePath), JSON.stringify(updatedLocaleObject, null, '\t');
    })
}

const translateLocalesFiles = async () => {
    const localeNames = getLocaleNames()
    const updatedLocales = await Promise.all(localeNames.map(async (name) => {
        return await updateLocale(getLocaleJSON(name), getLocaleLang(name), getSourceState())
    }))
    rewriteLocaleFiles(updatedLocales);
}

translateLocalesFiles();
