const {
    getValuesMap,
    optimizeSource,
    getNewKeysByMap,
    translateByMap
} = require('./helpers.js')
const { exeptionsArr } = require('./exeptions.js');

const updateLocale = async (fileName, locale, targetLang, sourceState) => {
    const { newSource, oldSourceMap, newSourceMap, diffsOnSources } = sourceState;
    const localeMap = getValuesMap(locale);
    const diffsOnLocale = getNewKeysByMap(newSourceMap, localeMap);
    const toTranslateMap = {...diffsOnLocale, ...diffsOnSources};
    console.log('toTranslateMap', toTranslateMap);
    const optimizedNewSource = optimizeSource(oldSourceMap, locale, newSource, diffsOnSources);
    const updatedLocaleObject = await translateByMap(toTranslateMap, optimizedNewSource, targetLang, exeptionsArr);
    return { fileName, updatedLocaleObject }
}

module.exports = {
    updateLocale
}