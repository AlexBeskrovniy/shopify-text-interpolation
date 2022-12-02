const cheerio = require('cheerio');

const interpolate = (str) => { //NOTE: has bug
    return str.replace(/(?<!\=\\|\"){{\s*([\w]*)\s*}}(?!\\|\")/gm, (m, p) => {
        return `<tt traslate-key="${p}">${p}</tt>`;
    });
}

const deinterpolate = (str) => {
    const $ = cheerio.load(str, {
        decodeEntities: true
    }, false);
    
    $('tt').each((_, item) => {
        $(item).replaceWith(`{{ ${$(item).attr('traslate-key')} }}`)
    })

    return $.html();
}

module.exports = { 
    interpolate,
    deinterpolate
}