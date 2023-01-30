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

ignoreExeptions("Tweet on Twitter", exeptionsArr);
// console.log(deinterpolateExeptions("Tweet on <span no-translate=\"Twitter\">Twitter</span>"));

// const translateStr = async (strArr) => {
//     const langs = ['ru'];
//     const arr = [];
//     await Promise.all(langs.map(lang => strArr.map(async str => {
//         const [translation] = await translateApi.translate(str, lang);
//         // arr.push(`${lang} - ${str} - ${translation}`);
//         console.log(`${lang} - ${str} - ${translation}`);
//     })));
    
//     arr.map(p => {
//         console.log(p)
//     });
// }

// translateStr([
    // "Twitter",
	// "Facebook",
	// "Pinterest",
	// "Instagram",
	// "Tumblr",
	// "Snapchat",
	// "YouTube",
	// "Vimeo",
	// "TikTok",
    // "Share on Facebook",
//     "Tweet on <span translate='no'>Twitter</span>"
// ]);

// const test_test = {
//     case: "Tweet on Twitter",
//     expect: "Твитнуть в Twitter"
// }

module.exports = {
    ignoreExeptions
}