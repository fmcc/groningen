var R = require('ramda');
var utils = require('../utils.js');
require('./outdent');
require('./behaviour');
require('./highlight');

// flatProps :: (String, [Objects]) => [Objects]
const flatProps = (a, xs) => R.chain(R.prop(a), R.filter(R.has(a), xs));

// trim :: String => String
const trim = s => s.trim();

// split :: String => String => [String]
const split = a => s => s.split(a);

// escRegExp :: String => String
const escRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// highlightToken :: (String, String) => Object
const highlightToken = (t, r) => ({token : t, regex: escRegExp(r)});

// notEmpty :: String => Boolean
const notEmpty = s => s != '';

// nonEmptyStrings :: [String] => [String]
const nonEmptyStrings = R.compose(R.filter(notEmpty), R.map(trim));

// splitTemplate :: Object => [String]
const splitTemplate = R.compose(nonEmptyStrings, split(/{\w+}/), R.propOr('','template'));

// allSplitTemplates :: [Object] => [String]
const allSplitTemplates = R.map(splitTemplate);

// metaTagToken :: [String] => Object
const metaTagToken = a => ({start: a[0], end: a[a.length-1], mid: a.slice(1, a.length-1)});

// constantToken :: [String] => Object
const constantToken = a => ({constant: a[0]});

// generateElementTokens :: String => [String] 
const generateHighlightToken = p => a => highlightToken(p + a[0], a[1]);

// isSingleton :: [a] => Boolean 
const isSingleton = R.compose(R.equals(1), R.length);

// notSingleton :: [a] => Boolean 
const notSingleton = R.compose(R.not, isSingleton);

// generateConstantTags :: [String] => [Object]
const generateConstantTags = xs => R.map(generateHighlightToken(""), 
					R.chain(R.compose(R.toPairs, constantToken),
					    R.filter(isSingleton, xs)));

// generateMetaTags :: [String] => [Object]
const generateMetaTags = xs => R.map(generateHighlightToken("meta.tag."), 
				    R.chain(R.compose(R.chain(utils.pairProduct), R.toPairs, metaTagToken), 
					R.filter(notSingleton, xs)));

// generateAttrTags :: [String] => [Object]
const generateAttrTags = xs => R.map(R.compose(generateHighlightToken(""), R.pair("string.attribute-value")), flatProps('attr', xs)); 

// tagGenerator :: ([Object], [String]) => [Object]
const tagGenerator = (xs, ys) => R.flatten([generateAttrTags(xs), generateMetaTags(ys), generateConstantTags(ys)]);

// generateTags :: [Object] => [Object]
const generateTags = xs => tagGenerator(xs, allSplitTemplates(xs));

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

var MatchingBraceOutdent = acequire("./matching_brace_outdent").MatchingBraceOutdent;
var DynamicLeidenPlusHighlight = acequire("ace/mode/dynamic_leiden_plus_highlight").DynamicLeidenPlusHighlight;
var DynamicLeidenPlusBehaviour = acequire("ace/mode/dynamic_leiden_plus_behaviour").DynamicLeidenPlusBehaviour;

var Mode = function(lang_def) {
    var Highlight = new DynamicLeidenPlusHighlight(generateTags(lang_def.elements));
    this.$tokenizer = new Tokenizer(Highlight.getRules());
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new DynamicLeidenPlusBehaviour(R.map(metaTagToken, R.filter(notSingleton, allSplitTemplates(lang_def.elements))));
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


var aye = ace.acequire('ace/mode/dynamic_leiden_plus');

var setMode = (ed, l) => ed.getSession().setMode(new aye.Mode(l));

exports.setMode = setMode;
