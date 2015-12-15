var R = require('ramda');

/* Template formatting */
// bracesWrap :: String -> String
const bracesWrap = (x) => `{${x}}`;

// replaceLangPlaceholder :: (String, String, String) -> String
const replaceLangPlaceholder = (placeholder, insert, template) => template.replace(bracesWrap(placeholder), insert); 

// renderer :: Object -> Function 
const render = (a) => R.compose(R.apply(R.compose), R.map(R.partial(replaceLangPlaceholder)))(R.toPairs(a))

// twoSplit :: Object AceSplit => Boolean
const twoSplits = (split) => (split.getSplits() == 2 ? true : false);

// setSplit :: Int => Object AceSplit => IO DOM
const setSplit = n => split => split.setSplits(n);

// toggleSplit :: Object AceSplit => IO DOM
const toggleSplit = R.ifElse(twoSplits, setSplit(1), setSplit(2));

// toggleSplit :: Object AceSplit => IO DOM
const openSplit = setSplit(2);

const setEditorText = ed => t => ed.setValue(t);

const setAnnotations = ed => a => ed.getSession().setAnnotations(a);

const openTextInSplit = env => t => [openSplit(env.split), setEditorText(env.split.$editors[1])(t)];

exports.element_insert = function (editor, lang_elem) {
    return function () {
            var t = editor.getSelectedText();
            var at = R.propOr("", "attr", lang_elem);
            var al = "";
            editor.insert(render({text:t, attr:at,alt:al})(lang_elem.template));
            editor.focus();
        };
    };

exports.toggleSplit = toggleSplit;
exports.setAnnotations = setAnnotations;
exports.openTextInSplit = openTextInSplit;
