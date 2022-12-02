const interpolate = (str) => { //NOTE: has bug
    return str.replace(/(?<!\=\\|\"){{\s*([\w]*)\s*}}(?!\\|\")/gm, (m, p) => {
        return `<tt traslate-key="${p}">${p}</tt>`;
    });
}

module.exports = { interpolate }