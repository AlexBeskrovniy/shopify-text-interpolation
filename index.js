// require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { shopify } = require('./shopify.js');

const { exeptionsArr } = require('./exeptions.js');

const {
    readAndParseJSON,
    getValuesMap,
    mergeObjectsValues,
    compareObjectsMaps,
    translateByMap,
    translateStr
} = require('./helpers.js')

// const translateToRu = async () => {
//     const mainAsset = await shopify.asset.get(process.env.TEST_THEME_ID, { 'asset[key]': "locales/en.default.json" });
//     const ruAsset = await shopify.asset.get(process.env.TEST_THEME_ID, { 'asset[key]': "locales/ru.json" })
//     const lang = ruAsset.key.split('/')[1].split('.')[0];
//     const fileName = ruAsset.key.split('/')[1];
//     const source = JSON.parse(mainAsset.value);
//     const locale = {};
//     fs.writeFileSync(path.join(__dirname, `./templates/in/${mainAsset.key}`), JSON.stringify(source, null, '\t'));
//     const valuesMap = getValuesMap(source);
//     const optimizedSourceLocale = mergeObjectsValues(valuesMap, locale, source);
//     const diffValuesMap = compareObjectsMaps(getValuesMap(source), getValuesMap(locale));
//     const translatedLocaleObject = await translateByMap(diffValuesMap, optimizedSourceLocale, lang, exeptionsArr);
//     fs.writeFileSync(path.join(__dirname, `./templates/out/${fileName}`), JSON.stringify(translatedLocaleObject, null, '\t'));
// }

// translateToRu();

// const test = async () => {
//     const translateable = new Promise((res) => {
//         setTimeout(() => res(translateStr("The highest price is {{ value }}", 'ru', exeptionsArr)), 4000);
//     })
//     const res = await translateable;
//     console.log(res);   
// }

// test();

const translateAllLocales = async () => {
    const mainAsset = await shopify.asset.get(process.env.TEST_THEME_ID, { 'asset[key]': "locales/en.default.json" });
    // fs.writeFileSync(path.join(__dirname, `./templates/in/${mainAsset.key}`), JSON.stringify(source, null, '\t'));
    const assets = await shopify.asset.list(process.env.TEST_THEME_ID);
    const locales = [...assets].filter(({ key }) => key.includes('locales/') && !key.includes('schema') && !key.includes('locales/en.default.json'));
    locales.map(async ({ key }) => {
        const source = JSON.parse(mainAsset.value);
        const locale = {};
        const valuesMap = getValuesMap(source);
        const targetAsset = await shopify.asset.get(process.env.TEST_THEME_ID, { 'asset[key]': `${key}` });
        const lang = targetAsset.key.split('/')[1].split('.')[0];
        const fileName = targetAsset.key.split('/')[1];
        
        const optimizedSourceLocale = mergeObjectsValues(valuesMap, locale, source);
        const diffValuesMap = compareObjectsMaps(getValuesMap(source), getValuesMap(locale));
        const translatedLocaleObject = await translateByMap(diffValuesMap, optimizedSourceLocale, lang, exeptionsArr);
        fs.writeFileSync(path.join(__dirname, `./templates/out/${fileName}`), JSON.stringify(translatedLocaleObject, null, '\t'));
        console.log(`Done ${lang}`);
    });
}
translateAllLocales();

const start = async () => {
    const source = readAndParseJSON('./templates/in/en.json');
    const locale = readAndParseJSON('./templates/in/ru.json');
    const valuesMap = getValuesMap(source);
    const optimizedSourceLocale = mergeObjectsValues(valuesMap, locale, source);
    const diffValuesMap = compareObjectsMaps(getValuesMap(source), getValuesMap(locale));
    const translatedLocaleObject = await translateByMap(diffValuesMap, optimizedSourceLocale);
    // fs.unlinkSync(path.join(__dirname, './templates/out/updated-ru.json'));
    fs.writeFileSync(path.join(__dirname, './templates/out/updated-ru.json'), JSON.stringify(translatedLocaleObject, null, '\t'));
}
start();


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