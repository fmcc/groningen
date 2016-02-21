var $ = require('jquery');
var R = require('ramda');

// $id :: String => jQuery Object
const $id = a => $('#' + a);

/* Template formatting */
// bracesWrap :: String -> String
const bracesWrap = (x) => `{${x}}`;

// replaceLangPlaceholder :: (String, String, String) -> String
const replaceLangPlaceholder = (placeholder, insert, template) => template.replace(bracesWrap(placeholder), insert); 

// render :: Object -> Function 
const render = (a) => R.compose(R.apply(R.compose), R.map(R.partial(replaceLangPlaceholder)))(R.toPairs(a))

// 
const moveBack = t => t.length - t.lastIndexOf('}') - 1;

// twoSplit :: Object AceSplit => Boolean
const twoSplits = (split) => (split.getSplits() == 2 ? true : false);

// setSplit :: Int => Object AceSplit => IO DOM
const setSplit = n => split => split.setSplits(n);

// toggleSplit :: Object AceSplit => IO DOM
const toggleSplit = R.ifElse(twoSplits, setSplit(1), setSplit(2));

// toggleSplit :: Object AceSplit => IO DOM
const openSplit = setSplit(2);

// setEditorText :: AceEditor -> String => IO DOM
const setEditorText = ed => t => ed.setValue(t, 1);

// setAnnotations :: AceEditor -> String => IO DOM
const setAnnotations = ed => a => ed.getSession().setAnnotations(a);

// bindInput :: (AceEditor, String) => IO DOM
const bindInput = (ed, a) => [ed.setValue($id(a).val()), 
        ed.getSession().on('change', function () { $id(a).val(ed.getValue()) })];

const openEpidocInSplit = env => t => [openSplit(env.split), env.epidoc_editor.setOptions(env.epidoc_options), setEditorText(env.epidoc_editor)(t)];

// toggleEpidocSplit :: AceSplit => IO DOM 
const toggleEpidocSplit = env => [toggleSplit(env.split), env.epidoc_editor.setOptions(env.epidoc_options)];

// toggleBehaviour :: AceEditor => IO DOM
const toggleBehaviour = ed => ed.setBehavioursEnabled(R.not(ed.getBehavioursEnabled()));

exports.element_insert = function (editor, lang_elem) {
    return function () {
            var t = editor.getSelectedText();
            var at = R.propOr("", "attr", lang_elem);
            var al = "";
            editor.insert(render({text:t, attr:at,alt:al})(lang_elem.template));
            editor.navigateLeft(moveBack(lang_elem.template));
            editor.focus();
        };
    };

exports.bindInput = bindInput;
exports.toggleBehaviour = toggleBehaviour;
exports.setAnnotations = setAnnotations;
exports.toggleEpidocSplit = toggleEpidocSplit;
exports.openEpidocInSplit = openEpidocInSplit;
