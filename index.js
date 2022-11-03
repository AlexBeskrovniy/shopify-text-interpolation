import 'dotenv/config';
import { v2 } from '@google-cloud/translate';
const { Translate } = v2;

const translateApi = new Translate({key: process.env.GOOGLE_API_KEY });

const regVars = /{{\s*\w+\s*}}/g
const regBracesLeft = /{{/
const regBracesRight = /}}/

export const translateTextTo = async (text, lang) => {
    try {
        const [translation] = await translateApi.translate(text, lang);
        return translation;
    } catch (err) {
        console.log(err);
    }
}

const getVars = (reg, str) => str.match(reg);

const getMap = (arr) => {
	const map = {};
	arr.map((key, index) => {
  	map[index] = key;
  });
  return map;
}

const indexVars = (vars, str) => {
	const map = getMap(vars);
  Object.entries(map).map(([key, val]) => {
  	str = str.replace(regBracesLeft, `<span id="${key}">`);
    str = str.replace(regBracesRight, '</span>');
  });
  return str;
}

const addVarsToTranslation = (map, str) => {
	Object.entries(map).map(([key, val]) => {
        const reg = new RegExp("<span id=\""+key+"\"[\\p{L}\\p{P}\\p{S}\\p{Z}]+>", 'u')
        str = str.replace(reg, val);
    });
    return str;
}

const getTranslatedStrWithVars = async (vars, map, text) => {
    const indexedString = indexVars(vars, text);
    console.log(indexedString);
    try {
        const translatedString = await translateTextTo(indexedString, 'ru');
        console.log(translatedString);
        const newStr = addVarsToTranslation(map, translatedString);

        return newStr;
    } catch(err) {
        console.error(err);
    }
}

//Text for Example
//const text = "Some text here"
const text = "{{ count }} result found for “{{ terms }}”";

const vars = getVars(regVars, text);

if (vars) {
    const varsMap = getMap(vars);
    const result = await getTranslatedStrWithVars(vars, varsMap, text);
    console.log(result);
} else {
    const result = await translateTextTo(text, 'ru');
    console.log(result);
}
