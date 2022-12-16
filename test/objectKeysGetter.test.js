const { getObjKeysArray } = require('../helpers.js');

const cases = [
    {   
        caseName: 'Empty object ?',
        inValue: {},
        outValue: []
    },
    {   
        caseName: 'Simple object',
        inValue: {
            "stringName": 'string',
            "number": '5',
            "5": 'number',
            "true": 'boolean',
            "false": 'boolean',
            "string": 'stringKey'
        },
        outValue: ['stringName','number','5','true','false','string']
    },
    {   
        caseName: 'Nested object',
        inValue: {
            "first": {
                "one": '1',
                "two": '2'
            },
            "seccond": {
                "seccondOne": {
                    "one": '211',
                    "two": '212'
                },
                "seccondTwo": '22'
            },
            "very_long_key_value_test": 'Long key value',
            "false": 'false'
        },
        outValue: ['first','one','two','seccond','seccondOne','one','two','seccondTwo','true','false']
    }
]

cases.forEach(({ caseName, inValue, outValue }) => {
    test(caseName, () => {
        expect(getObjKeysArray(inValue)).toStrictEqual(outValue)
    })
})