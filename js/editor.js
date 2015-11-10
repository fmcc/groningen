var R = require('ramda');

/* Template formatting */
// bracesWrap :: String -> String
const bracesWrap = (x) => `{${x}}`;

// replaceLangPlaceholder :: (String, String, String) -> String
const replaceLangPlaceholder = (placeholder, insert, template) => template.replace(bracesWrap(placeholder), insert); 

// renderer :: Object -> Function 
const render = (a) => R.compose(R.apply(R.compose), R.map(R.partial(replaceLangPlaceholder)))(R.toPairs(a))

/* Insertion  */

exports.element_insert = function (editor, lang_elem) {
    return function () {
            var t = editor.getSelectedText();
            var at = R.propOr("", "attr", lang_elem);
            var al = "";
            editor.insert(render({text:t, attr:at,alt:al})(lang_elem.template));
            editor.focus();
        };
    };
