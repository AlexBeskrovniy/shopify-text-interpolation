// const fs = require('fs');
// const path = require('path');

const {
    readAndParseJSON,
    getValuesMap,
    getNewKeysByMap,
    getChangedValuesByMap,
    getLocaleJSON,
    getLocaleNames,
    getLocaleLang,
    rewriteLocaleFiles
} = require('./helpers.js')
const { updateLocale } = require('./translationTools.js')

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


const translateLocalesFiles = async () => {
    const localeNames = getLocaleNames()
    const updatedLocales = await Promise.all(localeNames.map(async (name) => {
        return await updateLocale(name, getLocaleJSON(name), getLocaleLang(name), getSourceState())
    }))
    rewriteLocaleFiles(updatedLocales);
}

translateLocalesFiles();
