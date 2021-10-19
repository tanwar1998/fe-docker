/**
 * Inserting a style tag into the head of the document.
 * @param {Object} rules Accepts an object of CSS rules
 * @example
addStyleRule(
 {
   'h2': {
      'font-size': '30px',
      'color': 'red'
    },
    '.myClass' {
      'background-color': 'blue'
    }
  }, null, null
);
*/

function addStylesheet() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    if (id) styleEl.id = id;
    return styleEl.sheet;
}

function insertCSSRule(sheetEl, rulesKey, cssRule) {
    return sheetEl.insertRule(rulesKey + ('{ ' + cssRule + ' }'), sheetEl.cssRules.length);
}

function addStyleRule(rulesObj) {
    var sheet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var sheetEl = sheet ? sheet : addStylesheet(id);
    var rules = rulesObj ? rulesObj : {};
    Object.keys(rules).forEach(function (rulesKey) {
        var nestedValue = rules[rulesKey];
        Object.keys(nestedValue).forEach(function (nestedRulesKey) {
            var cssValue = nestedValue[nestedRulesKey];
            var cssRule = Array.isArray(cssValue) && cssValue[1] ? nestedRulesKey + ':' + cssValue[0] : nestedRulesKey + ':' + cssValue;
            return insertCSSRule(sheetEl, rulesKey, cssRule);
        });
    });
};
export { addStylesheet, insertCSSRule, addStyleRule };