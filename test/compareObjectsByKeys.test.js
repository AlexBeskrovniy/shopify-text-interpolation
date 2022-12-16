const { compareObjectsByKeys } = require('../helpers.js');

const simpleObjectMap = {
    "stringName": 'string',
    "number": '5',
    "5": 'number',
    "true": 'boolean',
    "false": 'boolean',
    "string": 'stringKey'
}
const simpleObjectMap2 = {
    "stringName": 'stringa',
    "number": '5ten',
    "5": 'number',
    "true_type": 'boolean',
    "false": 'boolean',
    "string": 'stringKey'
}

const nestedObjectMap = {
    "first.one": "1",
    "first.two": "2",
    "seccond.seccondOne.one": "211",
    "seccond.seccondOne.two": "212",
    "seccond.seccondTwo": "22",
    "very_long_key_value_test": "Long key value",
    "false": "false"
}
const nestedObjectMap2 = {
    "first.one": "22",
    "first.two": "23",
    "seccond.seccondOne": "21",
    "seccond.seccondOne.two": "212",
    "seccond.": "22",
    "very_long_key_value_test": "Long key value 2",
    "false": "false"
}

const cases = [
    {   
        caseName: 'Empty object 2',
        argOne: simpleObjectMap,
        argTwo: {},
        outValue: {}
    },
    {   
        caseName: 'Empty object 2',
        argOne: {},
        argTwo: simpleObjectMap,
        outValue: {}
    },
    {   
        caseName: 'Nested with simple',
        argOne: nestedObjectMap,
        argTwo: simpleObject,
        outValue: {}
    },
    {   
        caseName: 'Simple with nested',
        argOne: simpleObject,
        argTwo: nestedObject,
        outValue: {}
    },
]

// cases.forEach(({ caseName, argOne, argTwo, outValue }) => {
//     test(caseName, () => {
//         expect(getObjKeysArray(argOne, argTwo)).toStrictEqual(outValue)
//     })
// })