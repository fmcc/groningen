var R = require('ramda');

ace.define('ace/mode/folding/cstyle', ["require", 'exports', 'module' , 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], function(acequire, exports, module) {
    var oop = acequire("../../lib/oop");
    var Range = acequire("../../range").Range;
    var BaseFoldMode = acequire("./fold_mode").FoldMode;

    var FoldMode = exports.FoldMode = function(commentRegex) {
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(
                this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
            );
            this.foldingStopMarker = new RegExp(
                this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
            );
        }
    };
    oop.inherits(FoldMode, BaseFoldMode);
    (function() {
        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)|^note /;
        this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)|^end/;
        this.getFoldWidgetRange = function(session, foldStyle, row) {
            var line = session.getLine(row);
            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;
                if (match[1])
                    return this.openingBracketBlock(session, match[1], row, i);
                return session.getCommentFoldRange(row, i + match[0].length, 1);
            }
            if (foldStyle !== "markbeginend")
                return;
            var match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;
                if (match[1])
                    return this.closingBracketBlock(session, match[1], row, i);
                return session.getCommentFoldRange(row, i, -1);
            }
        };
    }).call(FoldMode.prototype);
});

ace.define('ace/mode/diagram', 
        ["require", 'exports', 'module', 
        'ace/lib/oop', 'ace/mode/text', 'ace/mode/text_highlight_rules',
        'ace/tokenizer', 'ace/mode/diagram_highlight_rules', 'ace/mode/folding/cstyle'], 
        function(acequire, exports, module) {
    "use strict";
    var oop = acequire("../lib/oop");

    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;
    var DynamicLeidenPlusRules = function(a) {
        this.$rules = a;
    };
    oop.inherits(DynamicLeidenPlusRules, TextHighlightRules);

    var TextMode = acequire("./text").Mode;
    var Tokenizer = acequire("../tokenizer").Tokenizer;
    var FoldMode = acequire("./folding/cstyle").FoldMode;
    var Mode = function(a) {
        var aye = {"start" : [{ token : "string", regex : '".*?"'},]}
        var highlighter = new DynamicLeidenPlusRules(a);
        this.foldingRules = new FoldMode();
        this.$tokenizer = new Tokenizer(highlighter.getRules());
        this.$keywordList = highlighter.$keywordList;
    };
    oop.inherits(Mode, TextMode);
    (function() {
        this.lineCommentStart = "'";
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

var tokens = xs => R.map(R.compose(langToken("string"), escRegExp), flatProps('attr', xs))
var tokens2 = xs => R.map(R.compose(langToken("keyword"), escRegExp), wit(xs))

var createH = xs => ({"start" : tokens(xs).concat(tokens2(xs))});

var aye = ace.acequire('ace/mode/diagram');

var setMode = (ed, l) => ed.getSession().setMode(new aye.Mode(createH(l)));

exports.aye = naw;
exports.setMode = setMode;
