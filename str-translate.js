require('dotenv').config();
const cheerio = require('cheerio');
const {Translate} = require('@google-cloud/translate').v2;
const translateApi = new Translate({key: process.env.GOOGLE_API_KEY });

const { translateStr, interpolateExeptions, deinterpolateExeptions } = require('./helpers.js')
const { exeptionsArr } = require('./exeptions.js');

const ignoreExeptions = async (str, exeptions) => {
    const interpolated = interpolateExeptions(str, exeptions);
    const translation = await translateStr(interpolated, 'ru');
    console.log(deinterpolateExeptions(translation));
    return deinterpolateExeptions(translation);
}

// ignoreExeptions("The highest price is 100", exeptionsArr);
const res = translateStr("The highest price is 100", 'ru', exeptionsArr);

module.exports = {
    ignoreExeptions
}