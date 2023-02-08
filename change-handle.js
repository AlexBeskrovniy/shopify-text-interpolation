const fs = require('fs');
const path = require('path');

const { exeptionsArr } = require('./exeptions.js');

const {
    readAndParseJSON,
    getValuesMap,
    optimizeSource,
    getNewKeysByMap,
    translateByMap,
    translateStr
} = require('./helpers.js')

// const start = async () => {
//     const source = readAndParseJSON('./templates/in/en.json');
//     const changed = readAndParseJSON('./templates/in/en_CHANGED.json');
//     const oldValuesMap = getValuesMap(source);
//     const newValuesMap = getValuesMap(changed);
//     const diffValuesMap = Object.entries(newValuesMap).reduce((acc, [keyMap, changedValue]) => {
//         if (oldValuesMap[keyMap] && oldValuesMap[keyMap] !== changedValue)
//         acc[keyMap] = changedValue
//         return acc
//     }, {})
//     const diffKeysMap = compareObjectsMaps(getValuesMap(source), getValuesMap(changed));
//     const diffsMaps = Object.assign(diffKeysMap, diffValuesMap);
//     console.log(diffsMaps);
//     const optimizedSourceLocale = optimizeSource(oldValuesMap, changed, source);
//     console.log(optimizedSourceLocale);
//     // const translatedLocaleObject = await translateByMap(diffsMaps, optimizedSourceLocale);
//     // fs.unlinkSync(path.join(__dirname, './templates/out/updated-ru.json'));
//     // fs.writeFileSync(path.join(__dirname, './templates/out/updated-ru.json'), JSON.stringify(translatedLocaleObject, null, '\t'));
// }
// start();
const getChangedValuesByMap = (newMap, oldMap) => {
    return Object.entries(newMap).reduce((acc, [keyMap, changedValue]) => {
        if (oldMap[keyMap] && oldMap[keyMap] !== changedValue)
        acc[keyMap] = changedValue
        return acc
    }, {})
} 
const start = async () => {
    const oldSource  = readAndParseJSON('./templates/in/en.json');
    const locale  = readAndParseJSON('./templates/in/ru.json');
    const newSource = readAndParseJSON('./templates/in/en_CHANGED.json');

    const oldMap = getValuesMap(oldSource);
    const newMap = getValuesMap(newSource);
    const newValuesMap = getChangedValuesByMap(newMap, oldMap)

    const newKeysMap = getNewKeysByMap(oldMap, newMap);
    const diffsOnEn = Object.assign(newKeysMap, newValuesMap);    
    
    const optimizedNewSource = optimizeSource(oldMap, locale, newSource, diffsOnEn);
    const diffValuesMap = getNewKeysByMap(newMap, getValuesMap(locale));
    const translatedLocaleObject = await translateByMap({...diffValuesMap, ...diffsOnEn}, optimizedNewSource, 'ru', exeptionsArr);
    fs.unlinkSync(path.join(__dirname, './templates/out/updated-ru.json'));
    fs.writeFileSync(path.join(__dirname, './templates/out/updated-ru.json'), JSON.stringify(translatedLocaleObject, null, '\t'));
}
start();
