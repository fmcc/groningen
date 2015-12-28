var R = require('ramda');
var utils = require('../utils.js');
require('./outdent');
require('./behaviour');
require('./highlight');

const tags = [[''], ['constant'], ['start','end'], ['start','mid','end']]

// nonEmptyStrings :: [String] => [String]
const nonEmptyStrings = R.compose(R.filter(R.compose(R.not, R.isEmpty)), R.map(R.trim));

// splitTemplate :: Object => [String]
const splitTemplate = R.compose(nonEmptyStrings, R.split(/{\w+}/), R.propOr('','template'));

// tagElements :: []
const tagElements = xs => R.zipObj(tags[R.length(xs)], xs);

// createTemplateElements :: Object => Object
const createTemplateElements = R.compose(R.objOf('elements'), tagElements, splitTemplate); 

// addTemplateElements :: Object => Object
const addTemplateElements = x =>  R.merge(x, createTemplateElements(x));

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
    var lang_elements = R.map(addTemplateElements, lang_def.elements);
    var Highlight = new DynamicLeidenPlusHighlight(lang_elements);
    this.$tokenizer = new Tokenizer(Highlight.getRules());
    this.$behaviour = new DynamicLeidenPlusBehaviour(lang_elements);
};

oop.inherits(Mode, TextMode);

(function() {
    this.voidElements = lang.arrayToMap([]);
}).call(Mode.prototype);

exports.Mode = Mode;
});

var aye = ace.acequire('ace/mode/dynamic_leiden_plus');

var setMode = (ed, l) => ed.getSession().setMode(new aye.Mode(l));

exports.setMode = setMode;
