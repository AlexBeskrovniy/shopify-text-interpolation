const { exeptions, ignoreExeptions } = require('../str-translate.js');

test('ignore exeptions', async () => {
    expect(await ignoreExeptions("Tweet on Twitter")).toBe("Твитнуть в Twitter");
})