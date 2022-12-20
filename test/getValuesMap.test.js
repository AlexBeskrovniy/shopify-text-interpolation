const { getValuesMap } = require('../helpers.js');

const cases = [
    {   
        caseName: 'Empty object ?',
        inValue: {},
        outValue: {}
    },
    {   
        caseName: 'Simple object',
        inValue: {
            "stringName": 'string',
            "number": '5',
            "true": 'boolean',
            "false": 'boolean',
            "string": 'stringKey'
        },
        outValue: {
            "stringName": 'string',
            "number": '5',
            "true": 'boolean',
            "false": 'boolean',
            "string": 'stringKey'
        }
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
        outValue: {
            "first.one": "1",
            "first.two": "2",
            "seccond.seccondOne.one": "211",
            "seccond.seccondOne.two": "212",
            "seccond.seccondTwo": "22",
            "very_long_key_value_test": "Long key value",
            "false": "false"
          }
    }
]

cases.forEach(({ caseName, inValue, outValue }) => {
    test(caseName, () => {
        expect(getValuesMap(inValue)).toStrictEqual(outValue)
    })
})