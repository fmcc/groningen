var $ = require('jquery');
var R = require('ramda');
var ace = require('brace');

require('brace/theme/dawn');
require('brace/ext/split.js');

var utils = require('./utils.js');
var ui = require('./ui.js');

var Split = ace.acequire("ace/ext/split").Split;
var container = document.getElementById("leiden-plus-editor");
var theme = ace.acequire("ace/theme/dawn");

function LeidenEditor(i) {
    // Initialises the Leiden Editor
    var ed_opt = { 
        fontSize: 16,
        maxLines: 200,
        showPrintMargin: false,
        theme: 'ace/theme/dawn',
        wrapBehavioursEnabled: true, 
        showInvisibles: true
    };

    var env = {};
    var split = new Split(document.getElementById(i.editor), theme, 1);
    env.editor = split.getEditor(0);

    env.editor.setOptions(ed_opt);
    //split.getEditor(1).setOptions(ed_opt);

    split.on("focus", function(editor) {
        env.editor = editor;
    });
    env.split = split;  

    ui.createUI($(i.controls), env, i.xsugar_url, i.language_definition);
    window.env = env;
    window.ed_opt = ed_opt;

    //env.split.setOptions(ed_opt);
};

window.LeidenEditor = LeidenEditor;
