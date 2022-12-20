const fs = require('fs');
const path = require('path');
const {Translate} = require('@google-cloud/translate').v2;

const { 
    interpolate, 
    deinterpolate, 
    getObjKeysArray,
    parseJSONFile,
    getValuesMap,
    compareObjectsMaps 
} = require('./helpers.js')

const translateApi = new Translate({key: process.env.GOOGLE_API_KEY });

const mergeObjectsValues = (keyMap, locale, source) => {
	const mergeBySteps = (steps, locale, acc) => {
      const step = steps.shift();

      if(!locale[step]) {
        return;
      } else if(typeof acc[step] === 'string' && typeof locale[step] === 'string') {
          acc[step] = locale[step];
      } else if (typeof acc[step] === 'object' && typeof locale[step] === 'object') {
          mergeBySteps(steps, locale[step], acc[step]);
      }
  };
  
    const sourceCopy = JSON.parse(JSON.stringify(source));
    Object.keys(keyMap).map(key => {
        const steps = key.split('.');
        mergeBySteps(steps, locale, sourceCopy);
    });
    
    return sourceCopy;
}

const translateUpdatedKeys = async (keyMap, updatedObj) => {
    const translateBySteps = async (steps, obj) => {
        const step = steps.shift();
        if (typeof obj[step] === 'string') {
            obj[step] = await translateStr(obj[step]);
            return;
        }
        if (typeof obj[step] === 'object') {
            await translateBySteps(steps, obj[step]);
        }
    }

    await Promise.all(Object.keys(keyMap).map(async (key) => {
        const steps = key.split('.');
        await translateBySteps(steps, updatedObj);
    }));

    return updatedObj;
}

const translateStr = async (str) => {
    const interpolatedStr = interpolate(str);
    const [translation] = await translateApi.translate(interpolatedStr, 'ru');
    return deinterpolate(translation)
}

const start = async () => {
    const source = parseJSONFile('./templates/in/en.json');
    const locale = parseJSONFile('./templates/in/ru.json');

    const valuesMap = getValuesMap(source);
    console.log(valuesMap);
    const updatedLocaleObject = mergeObjectsValues(valuesMap, locale, source);

    // const keysArrLocale = getObjKeysArray(locale);
    // const keysArrSource = getObjKeysArray(source);
    // const keysArrUpdated = getObjKeysArray(updatedLocaleObject);            

    const entriesDiffs = compareObjectsMaps(getValuesMap(source), getValuesMap(locale));
    // console.log(entriesDiffs);

    // if (keysArrLocale.length === keysArrSource.length) {
    //     console.log('Success +++ ', keysArrLocale.length, 'from', keysArrSource.length);
    // } else {
    //     console.log('False --- ', keysArrLocale.length, 'from', keysArrSource.length);
    // }

    // const checkDiff = compareObjectsMaps(getValuesMap(source), getValuesMap(updatedLocaleObject));

    // if (keysArrUpdated.length === keysArrSource.length) {
    //     console.log('Success +++ ', keysArrUpdated.length, 'from', keysArrSource.length, checkDiff);
    // } else {
    //     console.log('False --- ', keysArrUpdated.length, 'from', keysArrSource.length, checkDiff);
    // }

    const translatedLocaleObject = await translateUpdatedKeys(entriesDiffs, updatedLocaleObject);


    fs.unlinkSync(path.join(__dirname, './templates/out/updated-ru.json'));
    fs.writeFileSync(path.join(__dirname, './templates/out/updated-ru.json'), JSON.stringify(translatedLocaleObject, null, '\t'));
}

start()