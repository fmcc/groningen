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

// buttonObj
const button = a => f => ({text:`${a.name} ${ifAttr(a)}`, class: ifClass(a) , id: `button_${uScore(a.name+ifAttr(a))}`, click: f});

// createButton :: Object => Object
const createButton = (b) => $('<button/>', b);

// addTo :: Object => Object 
const addTo = obj => elem => obj.append(elem);

exports.createUI = function (env, config) {
    var addButtonToUI = R.compose(addTo($('#' + config.ui_container)), createButton);
    var defaultButton = a => f => R.mergeWith(spaceConcat, config.ui_button, button(a)(f));

    addButtonToUI(defaultButton({name:"Convert to Epidoc", class:"btn-primary"})(function (){xs.convertForSplit(config.xsugar_url, config.language_definition.type, env)(env.leiden_editor.getValue())} ));
    addButtonToUI(defaultButton({name:"Toggle Epidoc Panel", class:"btn-primary"})(function() {ed_tools.toggleSplit(env.split)}));

    R.map(R.compose(addButtonToUI, 
                R.converge(R.call, [defaultButton, R.partial(ed_tools.element_insert, [env.leiden_editor])])
               ), constructVariants('attr')(config.language_definition.elements));
    };
