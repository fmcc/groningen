var $ = require('jquery');
var R = require('ramda');
var ace = require('brace');

require('brace/theme/dawn');
require('brace/theme/monokai');
require('brace/ext/split.js');
require('brace/mode/xml');
require("brace/mode/text");

var hl = require("./highlight")

var utils = require('./utils.js');
var ui = require('./ui.js');

var Split = ace.acequire("ace/ext/split").Split;
var container = document.getElementById("leiden-plus-editor");
var theme = ace.acequire("ace/theme/dawn");
var theme2 = ace.acequire("ace/theme/monokai");
var xml_mode = ace.acequire("ace/mode/xml");

function LeidenEditor(i) {
    // Initialises the Leiden Editor
    var ed_opt = { 
        fontSize: 16,
        maxLines: 200,
        showPrintMargin: false,
        theme: 'ace/theme/monokai',
        mode: 'ace/mode/xml',
        wrapBehavioursEnabled: true, 
        showInvisibles: true
    };

    var env = {};
    var split = new Split(document.getElementById(i.editor), theme, 2);
    env.editor = split.getEditor(0);
    env.editor.setOptions(ed_opt);

    const allProp = (a, xs) => R.chain(R.prop(a), R.filter(R.has(a), xs));
    const concat = a => (b,c) => b + a + c;
    const attrStr = l => R.reduce(concat('|'), "", allProp('attr', l));
    
    const trim = s => s.trim();
    const splitter = a => s => s.split(a);


    console.log(R.chain(splitter(/{\w+}/), allProp('template',i.language_definition.elements)));

    hl.addHighlighting(env.editor, i.language_definition.elements);

    //split.getEditor(1).setOptions(ed_opt);
    split.setSplits(1);
    split.on("focus", function(editor) {
        env.editor = editor;
    });
    env.split = split;  
    ui.createUI($(i.controls), env, i.xsugar_url, i.language_definition);
    window.env = env;
};

window.LeidenEditor = LeidenEditor;
