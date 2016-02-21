var $ = require('jquery');
var R = require('ramda');

var ed_tools = require('./editor_tools.js');
var xs = require('./xsugar.js');

// spaceConcat :: (String, String) => String
const spaceConcat = (a, b) => a + " " + b;

// uScore :: String => String
const uScore = R.replace(/\W/g, '_');

// elemVariants :: String => Object => [Object]
const elemVariants = p => obj => R.map(R.merge(R.dissoc(p,obj)), R.map(R.objOf(p), R.prop(p, obj)));

// constructVariants:: String => [Object] => [Object]
const constructVariants = (a) => R.chain(R.when(R.prop(a), elemVariants(a)));

// ifAttr :: Object => String
const ifAttr = R.compose(R.replace(/\W/g,' '), R.propOr("", "attr"));

const ifClass = R.propOr("", "class");

// prevDef :: Function => Function
const prevDef = f => R.pipe(R.tap(e => e.preventDefault()), f);

// buttonObj
const button = a => f => ({text:`${a.name} ${ifAttr(a)}`, class: ifClass(a) , id: `button_${uScore(a.name+ifAttr(a))}`, click: prevDef(f)});

// createButton :: Object => Object
const createButton = (b) => $('<button/>', b);

// getOrCreateDiv :: String => Object
const getOrCreateDiv = (s) => $(`#${s}`).length ? $(`#${s}`) : $(`<div id='${s}'></div>`);

// addTo :: Object => Object 
const addTo = obj => elem => obj.append(elem);

exports.createUI = function (env, config) {
    var toContainer = addTo($('#' + config.ui_container));

    var ed_act = getOrCreateDiv('editor-actions'); 
    toContainer(ed_act); 
    var addButtonToEdAct = R.compose(addTo(ed_act), createButton);

    var ins_act = getOrCreateDiv('insertion-actions'); 
    toContainer(ins_act); 
    var addButtonToInsAct = R.compose(addTo(ins_act), createButton);

    var defaultButton = a => f => R.mergeWith(spaceConcat, config.ui_button, button(a)(f));

    addButtonToEdAct(defaultButton({name:"Convert to Epidoc", class:"btn-primary"})(function (){xs.convertForSplit(config.xsugar_url, config.language_definition.type, env)(env.leiden_editor.getValue())} ));
    addButtonToEdAct(defaultButton({name:"Toggle Epidoc Panel", class:"btn-primary"})(function() {ed_tools.toggleSplit(env.split)}));

    R.map(R.compose(addButtonToInsAct, 
                R.converge(R.call, [defaultButton, R.partial(ed_tools.element_insert, [env.leiden_editor])])
               ), constructVariants('attr')(config.language_definition.elements));
    };
