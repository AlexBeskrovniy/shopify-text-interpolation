const { interpolate } = require('../helpers.js')
// NOTE: ??? "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>"
// NOTE: bug "\"{{ number }}\""

const cases = [
    // [
    //     "Note: Fallback collection \"{{ title }}\" has no products.",
    //     `Note: Fallback collection <tt traslate-key="title">title</tt> has no products.`        
    // ],
    [
        "This shop will be powered by {{ shopify }}",
        `This shop will be powered by <tt traslate-key="shopify">shopify</tt>`        
    ],
    [
        "{{ rating_value }} out of {{ rating_max }} stars",
        `<tt traslate-key="rating_value">rating_value</tt> out of <tt traslate-key="rating_max">rating_max</tt> stars`        
    ],
    [
        "Pickup available at <span class=\"color-foreground\">{{ location_name }}<\/span>",
        `Pickup available at <span class=\"color-foreground\"><tt traslate-key="location_name">location_name</tt><\/span>`        
    ],
    [
        "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>",
        `Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>`        
    ],
    [
        "<a href=\"{{ link }}\" class=\"link underlined-link\">Log in<\/a> to check out faster.",
        `<a href=\"{{ link }}\" class=\"link underlined-link\">Log in<\/a> to check out faster.`        
    ],
    [
        "{{ rating_value }} out of {{ rating_max }} stars",
        `<tt traslate-key="rating_value">rating_value</tt> out of <tt traslate-key="rating_max">rating_max</tt> stars`        
    ],
    [
        "{{ number }}",
        `<tt traslate-key="number">number</tt>`
    ]
]

test('', () => {
    cases.forEach((strCase) => {
        expect(interpolate(strCase[0])).toBe(strCase[1])
    })
})