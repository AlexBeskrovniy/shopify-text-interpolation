const fs = require('fs');
const path = require('path');

const { Locale } = require('./models/locale.js');
const { dbConnect, dbDisconnect } = require('./connect.js');

const getOneLocale = async (lang) => {
    try {
        await dbConnect();
        const locale = await Locale.findOne({ lang: `${lang}` });
        const validData = JSON.parse(locale.doc);
        fs.writeFileSync(path.join(__dirname, `./test-db-json/${locale.lang}.json`), JSON.stringify(validData, null, '\t'));
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

        dbDisconnect();

        return localesObjects;
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    getOneLocale,
    getAllLocales
}