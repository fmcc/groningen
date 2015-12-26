var R = require('ramda');

const tokens = ['', 'constant', 'meta.tag', 'meta.tag']

// fa :: Function => [String] => *
const fa = f => a => f(a[0])(a[1]);

// dotJoin :: String, String => String 
const dotJoin = R.join('.');

// objLen :: Object => Int
const objLen = R.compose(R.length, R.keys);

// escRegExp :: String => String
const escRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// token :: (String, String) => Object
const token = (t, r) => ({token : t, regex: escRegExp(r)});

// prefixToken :: (String, String) => Object
const prefixToken = t => r => token(dotJoin(t), r);

// attrHighlight :: Object => Object
const attrHighlight = a => R.map(prefixToken(["string.attribute-value", a.name]), R.propOr([],'attr', a));

// elementHighlight :: Object => Object
const elementHighlight = a => R.map(fa(R.compose(prefixToken, R.append(R.__, [tokens[objLen(a.elements)], a.name]))), R.toPairs(a.elements));

// highlightTokens :: [Object] => [Object]
const highlightTokens = R.compose(R.flatten, R.ap([elementHighlight, attrHighlight]));

ace.define("ace/mode/dynamic_leiden_plus_highlight", ["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(acequire, exports, module) {
"use strict";

var oop = acequire("../lib/oop");
var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

var DynamicLeidenPlusHighlight = function(lang_elements) {
    this.$rules = {"start": highlightTokens(lang_elements)};
};
oop.inherits(DynamicLeidenPlusHighlight, TextHighlightRules);

exports.DynamicLeidenPlusHighlight = DynamicLeidenPlusHighlight;
});
