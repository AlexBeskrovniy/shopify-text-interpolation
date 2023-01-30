const { ignoreExeptions } = require('../str-translate.js');
const { exeptionsArr } = require('../exeptions.js');

test('ignore exeptions', async () => {
    expect(await ignoreExeptions("Tweet on Twitter, and return {{ value }}", exeptionsArr))
        .toBe("Твит в Twitter и возвращаемое {{ value }}");
})