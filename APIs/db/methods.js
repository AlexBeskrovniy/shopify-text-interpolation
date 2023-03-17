const fs = require('fs');

const { Locale } = require('./models/locale.js');
const { dbConnect, dbDisconnect } = require('./connect.js');

const { readAndParseJSON } = require('../../helpers.js');

const getOneLocale = async (lang, path) => {
    try {
        await dbConnect();
        const locale = await Locale.findOne({ lang: `${lang}` });
        const validData = JSON.parse(locale.doc);
        fs.writeFileSync(path.join(__dirname, `${path}/${locale.lang}.json`), JSON.stringify(validData, null, '\t'));
        dbDisconnect()
    } catch(err) {
        console.error(err)
    }
}

const getAllLocales = async () => {
    try {
        await dbConnect();
        const localesDocs = await Locale.find({});

        const localesObjects = localesDocs.reduce((acc, cur) => {
            const validData = JSON.parse(cur.doc);
            acc[cur.lang] = validData;
            return acc;
        }, {});

        return localesObjects;
    } catch(err) {
        console.error(err)
    }
}

const saveLocale = async (filename, path) => {
    try {
        const data = JSON.stringify(readAndParseJSON(`${path}/${filename}`));
        const lang = filename.split('.')[0];

        const body = {
            lang: lang,
            doc: data
        }

        const locale = new Locale(body);
        await locale.save();

        console.log(`${locale.lang} - saved`);
    } catch(err) {
        console.error(err);
    }
}

const saveAllLocales = async (path) => {
    try {
        await dbConnect();
        await Promise.all(fs.readdirSync(path).map(async (file) => await saveLocale(file)));

        dbDisconnect();
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    getOneLocale,
    getAllLocales
}