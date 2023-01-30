const { interpolate, deinterpolate, interpolateExeptions, deinterpolateExeptions } = require('../helpers.js')
const { exeptionsArr } = require('../exeptions.js');

const cases = [
    [
        "Note: Fallback collection \"{{ title }}\" has no products.",
        "Note: Fallback collection \"<tt traslate-key=\"title\">title</tt>\" has no products."        
    ],
    [
        "This shop will be powered by {{ shopify }}",
        "This shop will be powered by <tt traslate-key=\"shopify\">shopify</tt>"        
    ],
    [
        "{{ rating_value }} out of {{ rating_max }} stars",
        "<tt traslate-key=\"rating_value\">rating_value</tt> out of <tt traslate-key=\"rating_max\">rating_max</tt> stars"        
    ],
    [
        "Pickup available at <span class=\"color-foreground\">{{ location_name }}<\/span>",
        "Pickup available at <span class=\"color-foreground\"><tt traslate-key=\"location_name\">location_name</tt><\/span>"        
    ],
    [
        "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>",
        "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>"        
    ],
    [
        "<a href=\"{{ link }}\" class=\"link underlined-link\">Log in<\/a> to check out faster.",
        "<a href=\"{{ link }}\" class=\"link underlined-link\">Log in<\/a> to check out faster."        
    ],
    [
        "{{ rating_value }} out of {{ rating_max }} stars",
        "<tt traslate-key=\"rating_value\">rating_value</tt> out of <tt traslate-key=\"rating_max\">rating_max</tt> stars"        
    ],
    [
        "{{ number }}",
        "<tt traslate-key=\"number\">number</tt>"
    ],
    [
        "Pickup currently unavailable at <span class=\"color-foreground\">{{ location_name }}<\/span>",
        "Pickup currently unavailable at <span class=\"color-foreground\"><tt traslate-key=\"location_name\">location_name</tt><\/span>"
    ]
]

const casesForExeptions = [
    [
        "Twitter",
        "<span no-translate=\"Twitter\">Twitter<\/span>"
    ],
    [
        "Facebook",
        "<span no-translate=\"Facebook\">Facebook<\/span>"
    ],
    [
        "Pinterest",
        "<span no-translate=\"Pinterest\">Pinterest<\/span>"
    ],
    [
        "Instagram",
        "<span no-translate=\"Instagram\">Instagram<\/span>"
    ],
    [
        "Tumblr",
        "<span no-translate=\"Tumblr\">Tumblr<\/span>"
    ],
    [
        "Snapchat",
        "<span no-translate=\"Snapchat\">Snapchat<\/span>"
    ],
    [
        "YouTube",
        "<span no-translate=\"YouTube\">YouTube<\/span>"
    ],
    [
        "Vimeo",
        "<span no-translate=\"Vimeo\">Vimeo<\/span>"
    ],
    [
        "TikTok",
        "<span no-translate=\"TikTok\">TikTok<\/span>"
    ],
    [
        "Share on Facebook",
        "Share on <span no-translate=\"Facebook\">Facebook<\/span>"
    ],
    [
        "Tweet on Twitter",
        "Tweet on <span no-translate=\"Twitter\">Twitter<\/span>"
    ],
    [
        "Pin on Pinterest",
        "Pin on <span no-translate=\"Pinterest\">Pinterest<\/span>"
    ],
    [
        "Share by e-mail",
        "Share by e-mail"
    ],
    [
        "Share on Facebo",
        "Share on Facebo"
    ],
    [
        "Pickup available at <span class=\"color-foreground\">{{ location_name }}</span>",
        "Pickup available at <span class=\"color-foreground\">{{ location_name }}</span>"
    ]

]

test('String interpolation', () => {
    cases.forEach((strCase) => {
        expect(interpolate(strCase[0])).toBe(strCase[1])
    })
})

test('String deinterpolation', () => {
    cases.forEach((strCase) => {
        expect(deinterpolate(strCase[1])).toBe(strCase[0])
    })
})

test('Exeptions interpolation', () => {
    casesForExeptions.forEach((strCase) => {
        expect(interpolateExeptions(strCase[0], exeptionsArr)).toBe(strCase[1])
    })
})

test('Exeptions deinterpolation', () => {
    casesForExeptions.forEach((strCase) => {
        expect(deinterpolateExeptions(strCase[1])).toBe(strCase[0])
    })
})