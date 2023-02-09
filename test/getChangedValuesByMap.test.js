const { getChangedValuesByMap } = require('../helpers.js');

const cases = [
    {   
        caseName: 'Get only changed values map',
        maps: [
            {
                "seccond.seccondOne.one": "Seccond seccondOne 1 CHANGED",
                "seccond.seccondOne.two": "Seccond seccondOne 2 CHANGED",
                "seccond.seccondTwo": "Seccond seccondTwo",
                "very_long_key_value_test": "Long key value",
                "false": "true CHANGED"
            },
            {
                "first.one": "First",
                "first.two": "Seccond",
                "seccond.seccondOne.one": "Seccond seccondOne one",
                "seccond.seccondOne.two": "Seccond seccondOne two",
                "seccond.seccondTwo": "Seccond seccondTwo",
                "very_long_key_value_test": "Long key value",
                "false": "false"
            }
        ],
        outValue: {
            "seccond.seccondOne.one": "Seccond seccondOne 1 CHANGED",
            "seccond.seccondOne.two": "Seccond seccondOne 2 CHANGED",
            "false": "true CHANGED"
        }
    }
]

cases.forEach(({ caseName, maps, outValue }) => {
    test(caseName, () => {
        expect(getChangedValuesByMap(maps[0], maps[1])).toStrictEqual(outValue)
    })
})