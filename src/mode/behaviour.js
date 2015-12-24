var R = require('ramda');

ace.define("ace/mode/dynamic_leiden_plus_behaviour",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"], function(acequire, exports, module) {
"use strict";

var oop = acequire("ace/lib/oop");
var Behaviour = acequire("ace/mode/behaviour").Behaviour;
var TokenIterator = acequire("ace/token_iterator").TokenIterator;
var lang = acequire("ace/lib/lang");

const isType = (token, type) => token.type.lastIndexOf(type) > -1;

// splt :: String => [String]
const splt = R.split('');

// tagChars :: String => Function 
const tagChars = t => R.compose(R.uniq, R.chain(R.compose(splt, R.prop(t))))

// splitProp :: String => Function
const splitProp = p => R.compose(splt, R.prop(p))

// propLenSort :: String => Function
const propLenSort = p => R.sortBy(R.compose(R.length, R.prop(p)));

// trieAddProp :: String => (Object, Object) => Object
const trieAddProp = p => (t, c) => R.assocPath(splitProp(p)(c), c, t);

// buildPropTrie :: (String, [Object}) => Object
const buildPropTrie = (p, xs) => R.reduce(trieAddProp(p), {}, propLenSort(p)(xs));

const queryTrie = t => s => R.path(splt(s), t);

// objLenEq = Int => Function
const objLenEQ = x => R.compose(R.equals(x), R.length, R.keys);

const isLangObj = R.allPass([R.prop('start'), objLenEQ(3)]);

var DynamicLeidenPlusBehaviour = function (elements) {
            
    var start_trie = buildPropTrie('start', elements);
    var start_chars = tagChars('start')(elements);
    var q = queryTrie(start_trie);

    var insertTag = function (iter, pos, text, token, tag) {
        var element = token.value;
        if (iter.getCurrentTokenRow() == pos.row)
            element = element.substring(0, pos.column - iter.getCurrentTokenColumn());
        var wit =  {
            text: text + R.join(" ", tag.mid) + tag.end,
            selection: [1, 1]
        };
        return wit;
    };


    this.add("autoclosing", "insertion", function (state, action, editor, session, text) {
        var p = editor.getCursorPosition();
        var i = new TokenIterator(session, p.row, p.column);
        var t = i.getCurrentToken() || i.stepBackward();
        // return if this is the first character typed
        if (!t) {return};
        // if the character typed is not one that is in tags
        if (R.not(R.contains(text, start_chars))) {
            if (isType(t, "start")) {
                return insertTag(i, p, text, t, q(t.value));
            } else {
                console.log(1);
                return;
            }
        } else {
            var c_tag = q(t.value + text);
            if (c_tag && isLangObj(c_tag)) {
                return; 
            } else {
                var tag = q(text);
                var t_tag = q(t.value);
                console.log(t.value);
                console.log(c_tag);
                console.log(t_tag);
            }
        }
        // if just the text is the tag, then wait. 
        // if the text and token can't be anything, use the token value
        // if the text and token could be something, wait
        // if the text and token are something, and nothing else, use that.
    });

    this.add("autoindent", "insertion", function (state, action, editor, session, text) {
        if (text == "\n") {
            var cursor = editor.getCursorPosition();
            var line = session.getLine(cursor.row);
            var iterator = new TokenIterator(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();

            if (token && token.type.indexOf("tag-close") !== -1) {
                if (token.value == "/>")
                    return;
                while (token && token.type.indexOf("tag-name") === -1) {
                    token = iterator.stepBackward();
                }

                if (!token) {
                    return;
                }

                var tag = token.value;
                var row = iterator.getCurrentTokenRow();
                token = iterator.stepBackward();
                if (!token || token.type.indexOf("end-tag") !== -1) {
                    return;
                }

                if (this.voidElements && !this.voidElements[tag]) {
                    var nextToken = session.getTokenAt(cursor.row, cursor.column+1);
                    var line = session.getLine(row);
                    var nextIndent = this.$getIndent(line);
                    var indent = nextIndent + session.getTabString();

                    if (nextToken && nextToken.value === "</") {
                        return {
                            text: "\n" + indent + "\n" + nextIndent,
                            selection: [1, indent.length, 1, indent.length]
                        };
                    } else {
                        return {
                            text: "\n" + indent
                        };
                    }
                }
            }
        }
    });

};

oop.inherits(DynamicLeidenPlusBehaviour, Behaviour);

exports.DynamicLeidenPlusBehaviour = DynamicLeidenPlusBehaviour;
});

