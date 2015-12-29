var $ = require('jquery');
var R = require('ramda');
var ace = require('brace');

require('brace/theme/solarized_light');
require('brace/mode/xml');
require('brace/ext/split.js');
require('./mode/mode.js');

var utils = require('./utils.js');
var ui = require('./ui.js');

var Split = ace.acequire("ace/ext/split").Split;
var theme = ace.acequire("ace/theme/solarized_light");
ace.acequire("ace/mode/xml");

var DynamicLeidenPlusMode = ace.acequire('ace/mode/dynamic_leiden_plus').Mode;

var default_options = {
        fontSize: 16,
        maxLines: 200,
        showPrintMargin: false,
        theme: 'ace/theme/solarized_light',
        wrap: true,
        //showInvisibles: true, 
        tabSize: 2,
        useSoftTabs: true,
    };

function Groningen(i) {
    var env = {};
    var split = new Split(document.getElementById(i.editor), theme, 2);

    env.leiden_editor = split.getEditor(0);
    env.epidoc_editor = split.getEditor(1);

    // Suppresses error message about deprecated function. 
    env.leiden_editor.$blockScrolling = Infinity;
    env.epidoc_editor.$blockScrolling = Infinity;

    env.leiden_editor.setOptions(default_options);
    env.epidoc_editor.setOptions(default_options);

    env.leiden_editor.getSession().setMode(new DynamicLeidenPlusMode(i.language_definition));
    env.epidoc_editor.getSession().setMode("ace/mode/xml");

    env.leiden_editor.setBehavioursEnabled(true);
    env.epidoc_editor.setBehavioursEnabled(true);

    split.setSplits(1);
    env.opt = default_options;
    env.split = split;  

    ui.createUI($(i.controls), env, i.xsugar_url, i.language_definition);
    return env;
};

window.Groningen = Groningen;
