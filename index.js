// require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { shopify } = require('./shopify.js');

const { exeptionsArr } = require('./exeptions.js');

const {
    getValuesMap,
    optimizeSource,
    getNewKeysByMap,
    translateByMap,
} = require('./helpers.js')

// const translateAllLocales = async () => {
//     const mainAsset = await shopify.asset.get(process.env.TEST_THEME_ID, { 'asset[key]': "locales/en.default.json" });
//     // fs.writeFileSync(path.join(__dirname, `./templates/in/${mainAsset.key}`), JSON.stringify(source, null, '\t'));
//     const assets = await shopify.asset.list(process.env.TEST_THEME_ID);
//     const locales = [...assets].filter(({ key }) => key.includes('locales/') && !key.includes('schema') && !key.includes('locales/en.default.json'));
//     locales.map(async ({ key }) => {
//         const source = JSON.parse(mainAsset.value);
//         const locale = {};
//         const valuesMap = getValuesMap(source);
//         const targetAsset = await shopify.asset.get(process.env.TEST_THEME_ID, { 'asset[key]': `${key}` });
//         const lang = targetAsset.key.split('/')[1].split('.')[0];
//         const fileName = targetAsset.key.split('/')[1];
        
//         const optimizedSourceLocale = optimizeSource(valuesMap, locale, source);
//         const diffValuesMap = getNewKeysByMap(getValuesMap(source), getValuesMap(locale));
//         const translatedLocaleObject = await translateByMap(diffValuesMap, optimizedSourceLocale, lang, exeptionsArr);
//         fs.writeFileSync(path.join(__dirname, `./templates/out/${fileName}`), JSON.stringify(translatedLocaleObject, null, '\t'));
//         console.log(`Done ${lang}`);
//     });
// }
// translateAllLocales();
