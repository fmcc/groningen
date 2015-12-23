ace.define("ace/mode/dynamic_leiden_plus_highlight", ["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(acequire, exports, module) {
"use strict";

var oop = acequire("../lib/oop");
var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

var DynamicLeidenPlusHighlight = function(dyn_rules) {
    this.$rules = {"start": dyn_rules};
};
oop.inherits(DynamicLeidenPlusHighlight, TextHighlightRules);

exports.DynamicLeidenPlusHighlight = DynamicLeidenPlusHighlight;
});
