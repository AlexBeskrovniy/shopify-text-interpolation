const fs = require('fs');
const path = require('path');
// require('dotenv').config();

const { shopify } = require('./shopify.js');

const {
    readAndParseJSON,
    getValuesMap,
    mergeObjectsValues,
    compareObjectsMaps,
    translateByMap,
} = require('./helpers.js')

const translateAllLocales = async () => {
    const mainAsset = await shopify.asset.get(process.env.TEST_THEME_ID, { 'asset[key]': "locales/en.default.json" });
    const source = JSON.parse(mainAsset.value);
    fs.writeFileSync(path.join(__dirname, `./templates/in/${mainAsset.key}`), JSON.stringify(source, null, '\t'));
    const valuesMap = getValuesMap(source);
    console.log(Array.from(Object.entries(valuesMap)).length);
    const assets = await shopify.asset.list(process.env.TEST_THEME_ID);
    const locales = [...assets].filter(({ key }) => key.includes('locales/') && !key.includes('schema') && !key.includes('locales/en.default.json'));
    locales.map(async ({ key }) => {
        const targetAsset = await shopify.asset.get(process.env.TEST_THEME_ID, { 'asset[key]': `${key}` });
        const locale = JSON.parse(targetAsset.value);
        // const optimizedSourceLocale = mergeObjectsValues(valuesMap, locale, source);
        fs.writeFileSync(path.join(__dirname, `./templates/in/${targetAsset.key}`), JSON.stringify(locale, null, '\t'));
        console.log('Done');
    });
}
translateAllLocales();

// const start = async () => {
//     const source = readAndParseJSON('./templates/in/en.json');
//     const locale = readAndParseJSON('./templates/in/ru.json');
//     const valuesMap = getValuesMap(source);
//     const optimizedSourceLocale = mergeObjectsValues(valuesMap, locale, source);
//     const diffValuesMap = compareObjectsMaps(getValuesMap(source), getValuesMap(locale));
//     const translatedLocaleObject = await translateByMap(diffValuesMap, optimizedSourceLocale);
//     // fs.unlinkSync(path.join(__dirname, './templates/out/updated-ru.json'));
//     fs.writeFileSync(path.join(__dirname, './templates/out/updated-ru.json'), JSON.stringify(translatedLocaleObject, null, '\t'));
// }
// start();


// const { getObjKeysArray } = require('./helpers.js')
// const startWithLogs = async () => {
//     const source = readAndParseJSON('./templates/in/en.json');
//     const locale = readAndParseJSON('./templates/in/ru.json');

//     const valuesMap = getValuesMap(source);
//     const optimizedSourceLocale = mergeObjectsValues(valuesMap, locale, source);

//     const keysArrLocale = getObjKeysArray(locale);
//     const keysArrSource = getObjKeysArray(source);
//     const keysArrUpdated = getObjKeysArray(optimizedSourceLocale);            

//     const diffValuesMap = compareObjectsMaps(getValuesMap(source), getValuesMap(locale));
//     console.log(diffValuesMap);

//     if (keysArrLocale.length === keysArrSource.length) {
//         console.log('Success +++ ', keysArrLocale.length, 'from', keysArrSource.length);
//     } else {
//         console.log('False --- ', keysArrLocale.length, 'from', keysArrSource.length);
//     }

//     const checkDiff = compareObjectsMaps(getValuesMap(source), getValuesMap(optimizedSourceLocale));

//     if (keysArrUpdated.length === keysArrSource.length) {
//         console.log('Success +++ ', keysArrUpdated.length, 'from', keysArrSource.length, checkDiff);
//     } else {
//         console.log('False --- ', keysArrUpdated.length, 'from', keysArrSource.length, checkDiff);
//     }

//     const translatedLocaleObject = await translateUpdatedKeys(diffValuesMap, optimizedSourceLocale);


//     fs.unlinkSync(path.join(__dirname, './templates/out/updated-ru.json'));
//     fs.writeFileSync(path.join(__dirname, './templates/out/updated-ru.json'), JSON.stringify(translatedLocaleObject, null, '\t'));
// }

// startWithLogs()