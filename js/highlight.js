var R = require('ramda');

ace.define('ace/mode/dynamic_leiden_plus_rules', ["require", 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(acequire, exports, module) {
    var oop = acequire("../lib/oop");
    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    var DynamicLeidenPlusRules = function() {
	this.setKeywords = function(kwMap) {     
	    this.keywordRule.onMatch = this.createKeywordMapper(kwMap, "identifier")
        }
        this.keywordRule = {
            regex : /[^\s]+/,
            onMatch : function() {return "text"}
        }

        this.$rules = {
            "start" : [ 
		{
                token: "string",
                start: '"', 
                end: '"',
                next: [{ token : "constant.language.escape.lsl", regex : /\\[tn"\\]/}]
            	},
		this.keywordRule,
            ]
        };
	this.normalizeRules()
    };

    oop.inherits(DynamicLeidenPlusRules, TextHighlightRules);

    exports.DynamicLeidenPlusRules = DynamicLeidenPlusRules;
});

var TextMode = ace.acequire("ace/mode/text").Mode;
var dynamicMode = new TextMode();
dynamicMode.HighlightRules = ace.acequire('ace/mode/dynamic_leiden_plus_rules').DynamicLeidenPlusRules;


const allProp = (a, xs) => R.chain(R.prop(a), R.filter(R.has(a), xs));
const concat = a => (b,c) => b + a + c;
const attrStr = l => R.reduce(concat('|'), "", allProp('attr', l));

const setKeywords = (ed, kw) => ed.session.$mode.$highlightRules.setKeywords({"keyword": kw})

const addHighlighting = (ed, l) => [ed.session.setMode(dynamicMode), setKeywords(ed, attrStr(l))]; 

exports.addHighlighting = addHighlighting;

