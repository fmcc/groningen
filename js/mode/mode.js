var R = require('ramda');
require('brace/mode/xml');
require('./outdent');
require('./behaviour');
require('./highlight');

ace.define('ace/mode/dynamic_leiden_plus', 
        ["require", 'exports', 'module', 
        'ace/lib/oop', 
	'ace/lib/lang', 
	'ace/mode/text', 
        'ace/tokenizer', 
	'ace/mode/behaviour/dynamic_leiden_plus_behaviour', 
	"ace/mode/dynamic_leiden_plus_highlight",
	'ace/mode/folding/xml',
	'ace/worker/worker_client'
	], 
        function(acequire, exports, module) {
	"use strict";

var oop = acequire("ace/lib/oop");
var lang = acequire("ace/lib/lang");
var TextMode = acequire("ace/mode/text").Mode;
var Tokenizer = acequire("ace/tokenizer").Tokenizer;

var DynamicLeidenPlusHighlight = acequire("ace/mode/dynamic_leiden_plus_highlight").DynamicLeidenPlusHighlight;
var MatchingBraceOutdent = acequire("./matching_brace_outdent").MatchingBraceOutdent;
var DynamicLeidenPlusBehaviour = acequire("ace/mode/dynamic_leiden_plus_behaviour").DynamicLeidenPlusBehaviour;

var Mode = function(a) {
    var Highlight = new DynamicLeidenPlusHighlight(createH(a));
    this.$tokenizer = new Tokenizer(Highlight.getRules());
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new DynamicLeidenPlusBehaviour();
};

oop.inherits(Mode, TextMode);

(function() {
    this.voidElements = lang.arrayToMap([]);

    //this.checkOutdent = function(state, line, input) {
    //    return this.$outdent.checkOutdent(line, input);
    //};

    //this.autoOutdent = function(state, doc, row) {
    //    this.$outdent.autoOutdent(doc, row);
    //};
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
var tokens2 = xs => R.map(R.compose(langToken("meta.tag.start"), escRegExp), wit(xs))

var createH = xs => ({"start" : tokens(xs).concat(tokens2(xs))});

var aye = ace.acequire('ace/mode/dynamic_leiden_plus');

var setMode = (ed, l) => ed.getSession().setMode(new aye.Mode(l));

exports.aye = naw;
exports.setMode = setMode;
