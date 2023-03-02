const { translateStr } = require('../helpers.js');
const { exeptionsArr } = require('./exeptions.js');

const INTRPLStrings = [
    "Note: Fallback collection \"<tt traslate-key=\"title\">title</tt>\" has no products.",   
    "This shop will be powered by <tt traslate-key=\"shopify\">shopify</tt>",     
    "<tt traslate-key=\"rating_value\">rating_value</tt> out of <tt traslate-key=\"rating_max\">rating_max</tt> stars",        
    "Pickup available at <span class=\"color-foreground\"><tt traslate-key=\"location_name\">location_name</tt><\/span>",       
    "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>",
    "<a href=\"{{ link }}\" class=\"link underlined-link\">Log in<\/a> to check out faster.",
    "<tt traslate-key=\"rating_value\">rating_value</tt> out of <tt traslate-key=\"rating_max\">rating_max</tt> stars",    
    "<tt traslate-key=\"number\">number</tt>",   
    "Pickup currently unavailable at <span class=\"color-foreground\"><tt traslate-key=\"location_name\">location_name</tt><\/span>"
]

const translatedINTRPLStrings = [
    "Note: Fallback collection \"<tt traslate-key=\"title\">title</tt>\" has no products.",   
    "This shop will be powered by <tt traslate-key=\"shopify\">shopify</tt>",
    "<tt traslate-key=\"rating_value\">rating_value</tt> out of <tt traslate-key=\"rating_max\">rating_max</tt> stars",   
    "Pickup available at <span class=\"color-foreground\"><tt traslate-key=\"location_name\">location_name</tt><\/span>",
    "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>",
    "<a href=\"{{ link }}\" class=\"link underlined-link\">Log in<\/a> to check out faster.",
    "<tt traslate-key=\"rating_value\">rating_value</tt> out of <tt traslate-key=\"rating_max\">rating_max</tt> stars",
    "<tt traslate-key=\"number\">number</tt>",   
    "Pickup currently unavailable at <span class=\"color-foreground\"><tt traslate-key=\"location_name\">location_name</tt><\/span>"
]



test('Translate INTRPL strings', () => {
    INTRPLStrings.forEach((strCase, i) => {
        expect(translateStr(strCase, 'ru', exeptionsArr).toBe(translatedINTRPLStrings[i]))
    })
})