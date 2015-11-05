define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MyNewHighlightRules = function() {
   this.$rules = {
        "start" : [
            {
                token: "meta.tag.punctuation", // String, Array, or Function: the CSS token to apply
                regex: /</, // String or RegExp: the regexp to match
            }
        ]
    };
};

oop.inherits(MyNewHighlightRules, TextHighlightRules);

exports.MyNewHighlightRules = MyNewHighlightRules;

});
