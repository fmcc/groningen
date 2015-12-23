var R = require('ramda');
var ed_tools = require('./editor_tools.js');
var xs = require('./xsugar.js');

// elemVariants :: String => Object => [Object]
const elemVariants = p => obj => R.map(R.merge(R.dissoc(p,obj)), R.map(R.objOf(p), R.prop(p, obj)));

// constructVariants:: String => [Object] => [Object]
const constructVariants = (a) => R.chain(R.when(R.prop(a), elemVariants(a)));

// strip :: String -> String
const strip = R.replace(/\W/g,'');

const ifProp = (a) => R.propOr("", a);

const ifAttr = R.compose(strip, ifProp("attr"));

// buttonObj
const button = a => f => ({text:`${a.name} ${ifAttr(a)}`, id: `button_${a.name+ifAttr(a)}`, class:'btn btn-default', click: f});

// createButton :: Object => Object
const createButton = (b) => $('<button/>', b);

// addTo :: Object => Object 
const addTo = obj => elem => obj.append(elem);

exports.createUI = function (loc, env, url, lang) {
    addTo(loc)(createButton(button({name:"Convert to Epidoc"})(function (){xs.convertForSplit(url, env)(env.editor.getValue())} )));
    addTo(loc)(createButton(button({name:"Toggle Epidoc Panel"})(function() {ed_tools.toggleSplit(env.split)})));
    R.map(R.compose(addTo(loc), 
                createButton, 
                R.converge(R.call, [button, R.partial(ed_tools.element_insert, [env.editor])])
               ), constructVariants('attr')(lang.elements));
    };
