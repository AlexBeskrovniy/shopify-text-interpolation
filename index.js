const fs = require('fs');
const path = require('path');

const {
    readAndParseJSON,
    getValuesMap,
    mergeObjectsValues,
    compareObjectsMaps,
    translateByMap,
} = require('./helpers.js')

const start = async () => {
    const source = readAndParseJSON('./templates/in/en.json');
    const locale = readAndParseJSON('./templates/in/ru.json');
    const valuesMap = getValuesMap(source);
    const optimizedSourceLocale = mergeObjectsValues(valuesMap, locale, source);
    const diffValuesMap = compareObjectsMaps(getValuesMap(source), getValuesMap(locale));
    const translatedLocaleObject = await translateByMap(diffValuesMap, optimizedSourceLocale);
    fs.unlinkSync(path.join(__dirname, './templates/out/updated-ru.json'));
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