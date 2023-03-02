const { translateStr } = require('../helpers.js');
const { exeptionsArr } = require('../exeptions.js');

const INTRPLStrings = [
    "Note: Fallback collection \"<tt traslate-key=\"title\">title</tt>\" has no products.",   
    "This shop will be powered by <tt traslate-key=\"shopify\">shopify</tt>",     
    "<tt traslate-key=\"rating_value\">rating_value</tt> out of <tt traslate-key=\"rating_max\">rating_max</tt> stars",        
    "Pickup available at <span class=\"color-foreground\"><tt traslate-key=\"location_name\">location_name</tt><\/span>",       
    "Use fewer filters or <a class=\"{{ class }}\" href=\"{{ link }}\">clear all<\/a>",
    "<a href=\"{{ link }}\" class=\"link underlined-link\">Log in<\/a> to check out faster.",
    "<tt traslate-key=\"number\">number</tt>",   
    "Pickup currently unavailable at <span class=\"color-foreground\"><tt traslate-key=\"location_name\">location_name</tt><\/span>"
]

const translatedINTRPLStrings = [
    "Примечание. В резервной коллекции \"{{ title }}\" нет продуктов.",   
    "Этот магазин будет работать на основе {{ shopify }}",
    "{{ rating_value }} из {{ rating_max }} звезд",   
    "Самовывоз доступен в <span class=\"color-foreground\">{{ location_name }}</span>",
    "Используйте меньше фильтров или <a class=\"{{ class }}\" href=\"{{ link }}\">удалите все</a>",
    "<a href=\"{{ link }}\" class=\"link underlined-link\">Войдите</a> , чтобы проверить быстрее.",
    "{{ number }}",   
    "Самовывоз в настоящее время недоступен в <span class=\"color-foreground\">{{ location_name }}</span>"
]



test('Translate-INTRPL-strings', () => {
    INTRPLStrings.map((strCase, i) => {
        // return translateStr(strCase, 'ru', exeptionsArr).then( data => {
        //     expect(data).toBe(translatedINTRPLStrings[i])
        // } )
        translateStr(strCase, 'ru', exeptionsArr).then(data => expect(data).toBe(translatedINTRPLStrings[i]))
    })
})