const { Locale } = require('./APIs/db/models/locale.js');
const { dbDisconnect } = require('./APIs/db/connect.js');
const { updateLocale } = require('./translationTools.js');
const { getAllLocales } = require('./APIs/db/methods.js');
const { shopify } = require('./APIs/shopify.js');
const {
    readAndParseJSON,
    getValuesMap,
    getNewKeysByMap,
    getChangedValuesByMap,
    writeOutFile
} = require('./helpers.js')


const getSourceState = (oldSource, newSource) => {
    const oldSourceMap = getValuesMap(oldSource);
    const newSourceMap = getValuesMap(newSource);
    
    const changedValues = getChangedValuesByMap(newSourceMap, oldSourceMap);
    const newKeysMap = getNewKeysByMap(oldSourceMap, newSourceMap);
    const diffsOnSources = Object.assign(newKeysMap, changedValues);
    
    return { newSource, oldSourceMap, newSourceMap, diffsOnSources };
}

const getLocalesData = (locales) => {
    return Array.from(Object.entries(locales)).reduce((acc, [lang, locale]) => {
        if (lang === 'en') {
            acc.oldSource = locale;
            return acc
        };
        acc.locales.push({
            fileName: `${lang}.json`,
            locale: locale,
            lang: lang
        })
       return acc
    }, {oldSource: {}, locales: []});
} 

const updateLocaleDB = async ({fileName}) => {
    try {
        const data = JSON.stringify(readAndParseJSON(`${process.env.OUT_PATH}${fileName}`));
        const lang = fileName.split('.')[0];
        const existedLocale = await Locale.findOneAndUpdate({lang: lang}, {doc: data}, {new: true});
        console.log('Saved', lang, existedLocale.lang);
    } catch (error) {
        console.error(error);
    }
}

const translateLocales = async () => {
    const DBLocales = await getAllLocales();
    const { oldSource, locales } = getLocalesData(DBLocales);
    const enDefaultAsset = await shopify.asset.get(process.env.THEME_ID, { 'asset[key]': "locales/en.default.json" });
    const newSource = JSON.parse(enDefaultAsset.value);
    const updatedLocales = await Promise.all(locales.map(async ({lang, fileName, locale}) => {
        return await updateLocale(fileName, locale, lang, getSourceState(oldSource, newSource))
    }));
    writeOutFile({fileName: 'en.json', updatedLocaleObject: newSource});
    updatedLocales.map(writeOutFile);
    await Promise.all(updatedLocales.map(updateLocaleDB));
    await updateLocaleDB({fileName: 'en.json'});
    dbDisconnect();
}

translateLocales();