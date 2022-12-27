const { mergeObjectsValues } = require('../helpers.js');

// mergeObjectsValues(valuesMap, locale, source);

const cases = [
    {   
        caseName: 'Translated current locale',
        args: [
            {
                "first.one": "First",
                "first.two": "Seccond",
                "seccond.seccondOne.one": "Seccond seccondOne one",
                "seccond.seccondOne.two": "Seccond seccondOne two",
                "seccond.seccondTwo": "Seccond seccondTwo",
                "very_long_key_value_test": "Long key value",
                "false": "false"
            },
            {
                "first": {
                    "one": 'Первый',
                    "two": 'Второй'
                },
                "seccond": {
                    "seccondOne": {
                        "one": 'Второй второпервый первый',
                        "two": 'Второй второпервый второй'
                    },
                    "seccondTwo": 'Второй второ-второй'
                },
                "very_long_key_value_test": 'Длинный ключ',
                "false": 'Фолс'
            },
            {
                "first": {
                    "one": 'First',
                    "two": 'Seccond'
                },
                "seccond": {
                    "seccondOne": {
                        "one": 'Seccond seccondOne one',
                        "two": 'Seccond seccondOne two'
                    },
                    "seccondTwo": 'Seccond seccondTwo'
                },
                "very_long_key_value_test": 'Long key value',
                "false": 'false'
            }
        ],
        outValue: {
            "first": {
                "one": 'Первый',
                "two": 'Второй'
            },
            "seccond": {
                "seccondOne": {
                    "one": 'Второй второпервый первый',
                    "two": 'Второй второпервый второй'
                },
                "seccondTwo": 'Второй второ-второй'
            },
            "very_long_key_value_test": 'Длинный ключ',
            "false": 'Фолс'
        }
    },
// --------------------------------------------------------------------------------------------------
    {   
        caseName: 'Translated but reduced locale',
        args: [
            {
                "first.one": "First",
                "first.two": "Seccond",
                "seccond.seccondOne.one": "Seccond seccondOne one",
                "seccond.seccondOne.two": "Seccond seccondOne two",
                "seccond.seccondTwo": "Seccond seccondTwo",
                "very_long_key_value_test": "Long key value",
                "false": "false"
            },
            {
                "seccond": {
                    "seccondOne": {
                        "two": 'Второй второпервый второй'
                    },
                    "seccondTwo": 'Второй второ-второй'
                },
                "very_long_key_value_test": 'Длинный ключ',
            },
            {
                "first": {
                    "one": 'First',
                    "two": 'Seccond'
                },
                "seccond": {
                    "seccondOne": {
                        "one": 'Seccond seccondOne one',
                        "two": 'Seccond seccondOne two'
                    },
                    "seccondTwo": 'Seccond seccondTwo'
                },
                "very_long_key_value_test": 'Long key value',
                "false": 'false'
            }
        ],
        outValue: {
            "first": {
                "one": 'First',
                "two": 'Seccond'
            },
            "seccond": {
                "seccondOne": {
                    "one": 'Seccond seccondOne one',
                    "two": 'Второй второпервый второй'
                },
                "seccondTwo": 'Второй второ-второй'
            },
            "very_long_key_value_test": 'Длинный ключ',
            "false": 'false'
        }
    },
// //--------------------------------------------------------------------------------------------------
    {   
        caseName: 'Empty locale',
        args: [
            {
                "first.one": "First",
                "first.two": "Seccond",
                "seccond.seccondOne.one": "Seccond seccondOne one",
                "seccond.seccondOne.two": "Seccond seccondOne two",
                "seccond.seccondTwo": "Seccond seccondTwo",
                "very_long_key_value_test": "Long key value",
                "false": "false"
            },
            {},
            {
                "first": {
                    "one": 'First',
                    "two": 'Seccond'
                },
                "seccond": {
                    "seccondOne": {
                        "one": 'Seccond seccondOne one',
                        "two": 'Seccond seccondOne two'
                    },
                    "seccondTwo": 'Seccond seccondTwo'
                },
                "very_long_key_value_test": 'Long key value',
                "false": 'false'
            }
        ],
        outValue: {
            "first": {
                "one": 'First',
                "two": 'Seccond'
            },
            "seccond": {
                "seccondOne": {
                    "one": 'Seccond seccondOne one',
                    "two": 'Seccond seccondOne two'
                },
                "seccondTwo": 'Seccond seccondTwo'
            },
            "very_long_key_value_test": 'Long key value',
            "false": 'false'
        }
    },
// //--------------------------------------------------------------------------------------------------
    {   
        caseName: 'Updated source & reduced locale',
        args: [
            {
                "first.one": "First updated",
                "first.two": "Seccond updated",
                "seccond.seccondOne.one": "Seccond seccondOne one",
                "seccond.seccondOne.two": "Seccond seccondOne two updated",
                "seccond.seccondTwo": "Seccond seccondTwo",
                "very_long_key_value_test": "Long key value",
                "false": "false"
            },
            {
                "seccond": {
                    "seccondOne": {
                        "two": 'Второй второпервый второй'
                    },
                    "seccondTwo": 'Второй второ-второй'
                },
                "very_long_key_value_test": 'Длинный ключ',
            },
            {
                "first": {
                    "one": 'First updated',
                    "two": 'Seccond updated'
                },
                "seccond": {
                    "seccondOne": {
                        "one": 'Seccond seccondOne one',
                        "two": 'Seccond seccondOne two updated'
                    },
                    "seccondTwo": 'Seccond seccondTwo'
                },
                "very_long_key_value_test": 'Long key value',
                "false": 'false'
            }
        ],
        outValue: {
            "first": {
                "one": 'First updated',
                "two": 'Seccond updated'
            },
            "seccond": {
                "seccondOne": {
                    "one": 'Seccond seccondOne one',
                    "two": 'Seccond seccondOne two updated'
                },
                "seccondTwo": 'Второй второ-второй'
            },
            "very_long_key_value_test": 'Длинный ключ',
            "false": 'false'
        }
    },
// --------------------------------------------------------------------------------------------------

]

cases.forEach(({ caseName, args, outValue }) => {
    test(caseName, () => {
        expect(mergeObjectsValues(args[0], args[1], args[2])).toStrictEqual(outValue)
    })
})