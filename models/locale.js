const mongoose = require('mongoose');

const localeScheme = new mongoose.Schema({
    lang: String,
    doc: String,
}, { timestamps: true });

const Locale = mongoose.model("Locale", localeScheme, 'locales');

module.exports = { Locale };