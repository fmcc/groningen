var R = require('ramda');
var ed = require('./editor.js');

// elemVariants :: String => Object => [Object]
const elemVariants = p => obj => R.map(R.merge(R.dissoc(p,obj)), R.map(R.objOf(p), R.prop(p, obj)));

// constructVariants:: String => [Object] => [Object]
const constructVariants = (a) => R.chain(R.when(R.prop(a), elemVariants(a)))

// strip :: String -> String
const strip = R.replace(/\W/g,'');

const ifProp = (a) => R.propOr("", a);

const ifAttr = R.compose(strip, ifProp("attr"));

// buttonObj
const button = a => f => ({text:`${a.name} ${ifAttr(a)}`, id: `button_${a.name+ifAttr(a)}`, click: f});

// createButton :: Object => Object
const createButton = (b) => $('<button/>', b);

// addTo :: Object => Object 
const addTo = obj => elem => obj.append(elem);

exports.createUI = function (editor, loc, lang) {
    R.map(R.compose(addTo(loc), 
                createButton, 
                R.converge(R.call, [button, R.partial(ed.element_insert, [editor])])
                ), constructVariants('attr')(lang.elements));
};

