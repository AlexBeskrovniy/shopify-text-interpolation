const fs = require('fs');
const path = require('path');

const {
    readAndParseJSON,
    getValuesMap,
    getNewKeysByMap,
    getChangedValuesByMap,
    getLocaleJSON,
    getLocaleFileNames,
    getLocaleLang
} = require('../helpers.js')
const { updateLocale } = require('../translationTools.js')

//TEMP: use env
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

const rewriteTestLocaleFiles = (updatedLocales) => {
    updatedLocales.map(({ fileName, updatedLocaleObject }) => {
        const outFilePath = path.join(__dirname, `TestTemplates/locales/${fileName}`);
        fs.existsSync(outFilePath) && fs.unlinkSync(outFilePath);
        fs.writeFileSync(outFilePath, JSON.stringify(updatedLocaleObject, null, '\t'));
    });
}


const translateLocalesFiles = async () => {
    const localeNames = getLocaleFileNames()
    console.log(localeNames);
    const updatedLocales = await Promise.all(localeNames.map(async (name) => {
        return await updateLocale(name, getLocaleJSON(name), getLocaleLang(name), getSourceState())
    }))
    console.log(updatedLocales);
    rewriteTestLocaleFiles(updatedLocales);
}

translateLocalesFiles();
