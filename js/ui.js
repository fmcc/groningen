var R = require('ramda');

var ed_funcs = require('./editor.js');

// createButton :: lang_obj -> html_element
function createButton (ed, lang_obj) {
    return $('<button/>', {
        text: lang_obj.name,
        id: "button_" + lang_obj.name,
        click: ed_funcs.element_insert(ed, lang_obj),
    });
}

function addTo (add_to, element) {
    add_to.append(element);
};

exports.createUI = function (editor, loc, lang) {
    var addToUI = R.partial(addTo, [loc]);
    var edButton = R.partial(createButton, [editor]);
    R.map(addToUI, R.map(edButton, lang.elements));
};

