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
		{ token: "string", start: '"', end: '"', },
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


// flatProps :: (String, [Objects]) => [Objects]
const flatProps = (a, xs) => R.chain(R.prop(a), R.filter(R.has(a), xs));

// kwStr :: [String] => String
const kwStr = R.join('|');
    
// trim :: String => String
const trim = s => s.trim();

// split :: String => String => [String]
const split = a => s => s.split(a);

// attrKW :: [Object] => String 
const attrKW = xs => kwStr(flatProps('attr', xs));

//console.log(R.filter(!R.isEmpty, R.map(trim, R.chain(splitter(/{\w+}/), allProp('template',i.language_definition.elements)))));

const setKeywords = (ed, kw) => ed.session.$mode.$highlightRules.setKeywords({"keyword": kw})

const addHighlighting = (ed, l) => [ed.session.setMode(dynamicMode), setKeywords(ed, attrKW(l))]; 

exports.addHighlighting = addHighlighting;

