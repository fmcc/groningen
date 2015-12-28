var R = require('ramda');

// Bit surprised this isn't in Ramda. 
// hasPath :: [String] => Boolean
const hasPath = xs => R.compose(R.not, R.pathEq(xs, undefined)); 

// isType :: String => Object => Boolean
const isType = a => t => R.contains(a, t.type);

const isStartToken = isType('start');

// tagChars :: [String] => Function 
const tagChars = xs => R.compose(R.uniq, R.chain(R.compose(R.split(''), R.pathOr('', xs))))

// propLenSort :: String => Function
const propLenSort = p => R.sortBy(R.compose(R.length, R.path(p)));

const triePath = R.compose(R.intersperse('next'), R.split(''));

const propTriePath = p => R.compose(triePath, R.path(p));

// trieAddProp :: String => (Object, Object) => Object
const trieAddProp = p => (t, c) => R.assocPath(propTriePath(p)(c), c, t);

// buildPropTrie :: (String, [Object}) => Object
const buildPropTrie = (p, xs) => R.reduce(trieAddProp(p), {}, propLenSort(p)(xs));

const queryTrie = t => s => R.path(triePath(s), t);

// objLenEq = Int => Function
const objLenEQ = x => R.compose(R.equals(x), R.length, R.keys);

// notLast :: Object => Boolean
const notLast = R.has('next');

ace.define("ace/mode/dynamic_leiden_plus_behaviour",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"], function(acequire, exports, module) {
"use strict";

var oop = acequire("ace/lib/oop");
var Behaviour = acequire("ace/mode/behaviour").Behaviour;
var TokenIterator = acequire("ace/token_iterator").TokenIterator;
var lang = acequire("ace/lib/lang");

var DynamicLeidenPlusBehaviour = function (lang_elements) {
    var start_path = ['elements','start'];
    var start_trie = buildPropTrie(start_path, R.filter(hasPath(start_path), lang_elements));
    var start_chars = tagChars(start_path)(lang_elements);
    var q = queryTrie(start_trie);

    var insertTag = function (iter, pos, text, token, tag) {
        var element = token.value;
        if (iter.getCurrentTokenRow() == pos.row)
            element = element.substring(0, pos.column - iter.getCurrentTokenColumn());
        var str = R.ap([R.propOr('','mid'), R.propOr('', 'end')], [tag.elements]);
        return {
            text: text + R.join('', str),
            selection: [1, 1]
        };
    };

    this.add("autoclosing", "insertion", function (state, action, editor, session, text) {
        var p = editor.getCursorPosition();
        var i = new TokenIterator(session, p.row, p.column);
        var t = i.getCurrentToken() || i.stepBackward();
        if (!t) {return};
        // if the character typed is not one that is in tags
        if (R.not(R.contains(text, start_chars))) {
            if (isStartToken(t)) {
                return insertTag(i, p, text, t, q(t.value));
            } else {
                return;
            }
        } else {
            if (q(t.value + text)) {
                return;
            } else {
                var t_tag = q(t.value);
                if (t_tag) {
                    return insertTag(i, p, text, t, t_tag);
                }
            }
        }
    });

    this.add("autoindent", "insertion", function (state, action, editor, session, text) {
        if (text == "\n") {
            var cursor = editor.getCursorPosition();
            var line = session.getLine(cursor.row);
            var iterator = new TokenIterator(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();

            var row = iterator.getCurrentTokenRow();
            var nextToken = iterator.stepForward();
            var line = session.getLine(row);
            var nextIndent = this.$getIndent(line);
            var indent = nextIndent + session.getTabString();
            if (nextToken && isType('end', nextToken)) {
                return {
                    text: "\n" + indent + "\n" + nextIndent,
                    selection: [1, indent.length, 1, indent.length]
                };
            } else {
                return;
            }
        };
    });
    
    /*
    this.add("autoindent", "insertion", function (state, action, editor, session, text) {
        if (text == "\n") {
            
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
                token = iterator.stepBackward();
                if (!token || token.type.indexOf("end-tag") !== -1) {
                    return;
                }

                if (this.voidElements && !this.voidElements[tag]) {
                            }
        }
    });*/

};

oop.inherits(DynamicLeidenPlusBehaviour, Behaviour);

exports.DynamicLeidenPlusBehaviour = DynamicLeidenPlusBehaviour;
});

