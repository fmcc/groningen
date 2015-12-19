var R = require('ramda');
require('brace/mode/xml');

ace.define('ace/mode/dynamic_leiden_plus', 
        ["require", 'exports', 'module', 
        'ace/lib/oop',
	'ace/lib/lang', 
        'ace/mode/text',
        'ace/mode/text_highlight_rules',
        'ace/mode/xml_highlight_rules',
        'ace/tokenizer',
        'ace/mode/behaviour/xml',
        'ace/mode/folding/xml'], 
        function(acequire, exports, module) {
    "use strict";
    var oop = acequire("../lib/oop");
    var lang = acequire("ace/lib/lang");

    /*
     * 
     */
    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;
    var DynamicLeidenPlusRules = function(a) {
        this.$rules = a;
    };
    oop.inherits(DynamicLeidenPlusRules, TextHighlightRules);

    var TextMode = acequire("ace/mode/text").Mode;
    var XmlHighlightRules = acequire("ace/mode/xml_highlight_rules").XmlHighlightRules;
    var Tokenizer = acequire("ace/tokenizer").Tokenizer;
    var FoldMode = acequire("ace/mode/folding/xml").FoldMode;
    var Behaviour = acequire("ace/mode/behaviour/xml").XmlBehaviour;
    var Mode = function(a) {
        var highlighter = XmlHighlightRules;
        this.foldingRules = new FoldMode();
        this.$behaviour = new Behaviour();
        this.$tokenizer = new Tokenizer(highlighter.getRules());
    };
    oop.inherits(Mode, TextMode);

    (function() {
        // This is key to enabling lang behaviours - found through elimination 
        this.voidElements = lang.arrayToMap([]);
    }).call(Mode.prototype);
    exports.Mode = Mode;
});

// flatProps :: (String, [Objects]) => [Objects]
const flatProps = (a, xs) => R.chain(R.prop(a), R.filter(R.has(a), xs));

// trim :: String => String
const trim = s => s.trim();

// split :: String => String => [String]
const split = a => s => s.split(a);

// escRegExp :: String => String
const escRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// langToken :: (String, String) => Object
const langToken = t => r => ({token : t, regex: r});

const notEmpty = s => s != '';

const wit = xs => R.filter(notEmpty, R.map(trim, R.chain(split(/{\w+}/), flatProps('template',xs))));

var naw = function (xs) {
    console.log(wit(xs));
};

var tokens = xs => R.map(R.compose(langToken("string.attribute-value"), escRegExp), flatProps('attr', xs))
var tokens2 = xs => R.map(R.compose(langToken("meta.tag"), escRegExp), wit(xs))

var createH = xs => ({"start" : tokens(xs).concat(tokens2(xs))});

var aye = ace.acequire('ace/mode/dynamic_leiden_plus');

var setMode = (ed, l) => ed.getSession().setMode(new aye.Mode(createH(l)));

exports.aye = naw;
exports.setMode = setMode;
