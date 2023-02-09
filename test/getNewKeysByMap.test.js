const { getNewKeysByMap } = require('../helpers.js');

const cases = [
    {   
        caseName: 'Empty objects?',
        inValue: [{}, {}],
        outValue: {}
    },
    {   
        caseName: 'Source object is empty',
        inValue: [
            {},
            {
                'products.modal.label': 'Media gallery',
                'products.facets.apply': 'Apply',
                'general.share.twitter': 'Tweet',
                'general.share.pinterest': 'Pin',
                'general.share.email': 'E-mail'
            }
        ],
        outValue: {}
    },
    {   
        caseName: 'Target object is empty',
        inValue: [
            {
                'products.product.shipping_policy_html': '<a href="{{ link }}">Shipping</a> calculated at checkout.',
                'products.modal.label': 'Media gallery',
                'products.facets.apply': 'Apply',
                'general.share.twitter': 'Tweet',
                'general.share.pinterest': 'Pin',
                'general.share.email': 'E-mail',
                'general.slider.of': 'of',
                'templates.404.subtext': '404'
            },
            {}
        ],
        outValue: {
            'products.product.shipping_policy_html': '<a href="{{ link }}">Shipping</a> calculated at checkout.',
            'products.modal.label': 'Media gallery',
            'products.facets.apply': 'Apply',
            'general.share.twitter': 'Tweet',
            'general.share.pinterest': 'Pin',
            'general.share.email': 'E-mail',
            'general.slider.of': 'of',
            'templates.404.subtext': '404'
        }
    },
    {   
        caseName: 'The same objects',
        inValue: [
            {
                'products.product.shipping_policy_html': '<a href="{{ link }}">Shipping</a> calculated at checkout.',
                'products.modal.label': 'Media gallery',
                'products.facets.apply': 'Apply',
                'general.share.twitter': 'Tweet',
                'general.share.pinterest': 'Pin',
                'general.share.email': 'E-mail',
                'general.slider.of': 'of',
                'templates.404.subtext': '404'
            },
            {
                'products.product.shipping_policy_html': '<a href="{{ link }}">Shipping</a> calculated at checkout.',
                'products.modal.label': 'Media gallery',
                'products.facets.apply': 'Apply',
                'general.share.twitter': 'Tweet',
                'general.share.pinterest': 'Pin',
                'general.share.email': 'E-mail',
                'general.slider.of': 'of',
                'templates.404.subtext': '404'
            }
        ],
        outValue: {}
    },
    {   
        caseName: 'Objects with diffs',
        inValue: [
            {
                'products.product.shipping_policy_html': '<a href="{{ link }}">Shipping</a> calculated at checkout.',
                'products.modal.label': 'Media gallery',
                'products.facets.apply': 'Apply',
                'general.share.twitter': 'Tweet',
                'general.share.pinterest': 'Pin',
                'general.share.email': 'E-mail',
                'general.slider.of': 'of',
                'templates.404.subtext': '404',
                'custom.test.key': 'Custom test value'
            },
            {
                'products.product.shipping_policy_html': '<a href="{{ link }}">Shipping</a> calculated at checkout.',
                'products.facets.apply': 'Apply',
                'general.share.twitter': 'Tweet',
                'general.share.pinterest': 'Pin',
                'test': 'test',
                'fucking.nested.key': 'Fucking value',
                23456: 94857290348
            }
        ],
        outValue: {
            'products.modal.label': 'Media gallery',
            'general.share.email': 'E-mail',
            'general.slider.of': 'of',
            'templates.404.subtext': '404',
            'custom.test.key': 'Custom test value'
        }
    }
]

cases.forEach(({ caseName, inValue, outValue }) => {
    test(caseName, () => {
        expect(getNewKeysByMap(inValue[0], inValue[1])).toStrictEqual(outValue)
    })
})