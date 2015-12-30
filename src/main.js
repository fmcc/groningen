var $ = require('jquery');
var R = require('ramda');
var ace = require('brace');

require('brace/theme/solarized_light');
require('brace/mode/xml');
require('brace/ext/split.js');
require('./mode/mode.js');

var createUI = require('./ui.js').createUI;
var bindInput = require('./editor_tools.js').bindInput;
var Split = ace.acequire("ace/ext/split").Split;
var theme = ace.acequire("ace/theme/solarized_light");
ace.acequire("ace/mode/xml");

var DynamicLeidenPlusMode = ace.acequire('ace/mode/dynamic_leiden_plus').Mode;

var default_options = {
        fontSize: 16,
        showPrintMargin: false,
        theme: 'ace/theme/solarized_light',
        wrap: true,
        showInvisibles: true, 
        tabSize: 2,
        useSoftTabs: true,
    };

// mergeOptions :: String, Object => Object
var mergeOptions = (y,x) => R.ifElse(R.has(y), 
        R.compose(R.merge(default_options), R.prop(y)), R.always(default_options))(x);

function Groningen(config) {
    var env = {};
    env.split = new Split(document.getElementById(config.editor_container), theme, 2);

    env.leiden_editor = env.split.getEditor(0);
    env.epidoc_editor = env.split.getEditor(1);

    // Suppresses error message about deprecated function. 
    env.leiden_editor.$blockScrolling = Infinity;
    env.epidoc_editor.$blockScrolling = Infinity;
    
    env.leiden_options = mergeOptions("leiden_options", config);
    env.epidoc_options = mergeOptions("epidoc_options", config);

    env.leiden_editor.setOptions(env.leiden_options);
    env.epidoc_editor.setOptions(env.epidoc_options);

    env.leiden_editor.getSession().setMode(new DynamicLeidenPlusMode(config.language_definition));
    env.epidoc_editor.getSession().setMode("ace/mode/xml");
    
    // Default autocompletion and indentation on. 
    env.leiden_editor.setBehavioursEnabled(true);
    env.epidoc_editor.setBehavioursEnabled(true);
    
    // Only generate the UI if a container is defined.  
    if (R.has('ui_container', config)) { createUI(env, config) };

    // Bind inputs if they are defined. 
    if (R.has('leiden_output', config)) { bindInput(env.leiden_editor, config.leiden_output); }
    if (R.has('epidoc_output', config)) { bindInput(env.epidoc_editor, config.epidoc_output); }

    // Close the Epidoc split
    env.split.setSplits(1);

    return env;
};

window.Groningen = Groningen;
