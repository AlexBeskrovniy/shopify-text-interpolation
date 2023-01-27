require('dotenv').config();
const cheerio = require('cheerio');
const {Translate} = require('@google-cloud/translate').v2;
const translateApi = new Translate({key: process.env.GOOGLE_API_KEY });

const { translateStr } = require('./helpers.js');

const exeptions = ["Twitter", "Facebook", "Pinterest", "Instagram"];

const ignoreExeptions = async (str) => {
    const match = exeptions.find(el => str.includes(el))
    const interpolated = str.replace(match, `<span no-translate="${match}">${match}</span>`);
    const translation = await translateStr(interpolated, 'ru');
    // const [translation] = await translateApi.translate(interpolated, 'ru');

    const $ = cheerio.load(translation, {
        decodeEntities: true
    }, false);
    
    $('[no-translate]').each((_, item) => {
        $(item).replaceWith($(item).attr('no-translate'));
    })

    console.log($.html());
    return $.html();
}

ignoreExeptions("Tweet on Twitter");

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
    exeptions,
    ignoreExeptions
}