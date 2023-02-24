const fs = require('fs');
const path = require('path');

const { readAndParseJSON } = require('./helpers.js');

const { Locale } = require('./db/models/locale.js');
const { dbConnect, dbDisconnect } = require('./db/connect.js');

const saveLocale = async (filename) => {
    try {
        const data = JSON.stringify(readAndParseJSON(`./templates/locales/${filename}`));
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

const saveAllLocales = async () => {
    try {
        await dbConnect();
        await Promise.all(fs.readdirSync('./templates/locales/').map(async (file) => await saveLocale(file)));

        dbDisconnect();
    } catch(err) {
        console.error(err)
    }
}

// saveAllLocales();
