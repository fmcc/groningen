var $ = require('jquery');
var R = require('ramda');
var ace = require('brace');

require('brace/theme/solarized_light');
require('brace/mode/xml');
require('brace/ext/split.js');
var mode_tools = require('./mode/mode.js');

var utils = require('./utils.js');
var ui = require('./ui.js');

var Split = ace.acequire("ace/ext/split").Split;
var container = document.getElementById("leiden-plus-editor");
var theme = ace.acequire("ace/theme/solarized_light");
ace.acequire("ace/mode/xml");

function LeidenEditor(i) {
    // Initialises the Leiden Editor
    var ed_opt = { 
        fontSize: 16,
        maxLines: 200,
        showPrintMargin: false,
        theme: 'ace/theme/solarized_light',
        wrapBehavioursEnabled: true, 
        showInvisibles: true, 
        tabSize: 2,
        useSoftTabs: true,
        wrap: true,
    };

    var env = {};
    var split = new Split(document.getElementById(i.editor), theme, 2);
    env.editor = split.getEditor(0);
    // Suppresses error message about deprecated function. 
    env.editor.$blockScrolling = Infinity;
    env.editor.setOptions(ed_opt);

    mode_tools.setMode(env.editor, i.language_definition);
    env.editor.setBehavioursEnabled(true);
    //split.getEditor(1).setOptions(ed_opt);
    split.setSplits(1);
    split.on("focus", function(editor) {
        env.editor = editor;
    });
    env.opt = ed_opt;
    env.split = split;  
    env.split.$editors[1].getSession().setMode("ace/mode/xml");

    ui.createUI($(i.controls), env, i.xsugar_url, i.language_definition);
    window.env = env;
};

window.LeidenEditor = LeidenEditor;
