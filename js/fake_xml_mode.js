require('brace/mode/xml');

ace.define('ace/mode/fake_xml', 
        ["require", 'exports', 'module', 
        'ace/lib/oop', 
	'ace/lib/lang', 
	'ace/mode/text', 
	'ace/mode/xml_highlight_rules',
        'ace/tokenizer', 
	'ace/mode/behaviour/xml', 
	'ace/mode/folding/xml',
	'ace/worker/worker_client'
	], 
        function(acequire, exports, module) {
	"use strict";

var oop = acequire("ace/lib/oop");
var lang = acequire("ace/lib/lang");
var TextMode = acequire("ace/mode/text").Mode;
var XmlHighlightRules = acequire("ace/mode/xml_highlight_rules").XmlHighlightRules;
var XmlBehaviour = acequire("ace/mode/behaviour/xml").XmlBehaviour;
var XmlFoldMode = acequire("ace/mode/folding/xml").FoldMode;

var Mode = function() {
   this.HighlightRules = XmlHighlightRules;
   this.$behaviour = new XmlBehaviour();
   this.foldingRules = new XmlFoldMode();
};

oop.inherits(Mode, TextMode);

(function() {
    this.voidElements = lang.arrayToMap([]);
}).call(Mode.prototype);

exports.Mode = Mode;
});
