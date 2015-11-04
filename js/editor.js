var R = require('ramda');

function wrap_selected(editor, tag) {
    range = editor.getSelectionRange();
    editor.clearSelection();
    insert_at_postion(editor, tag.end, range.end);
    insert_at_postion(editor, tag.start, range.start);
    editor.focus();
};


// toAceAnnotation :: xsugarException -> aceAnnotation
const toAceAnnotation = (e) => { return {column:e.column, raw:e.cause, row:e.line, text:e.cause, type:"error"}};

/* Template formatting */
// bracesWrap :: String -> String
const bracesWrap = (x) => `{${x}}`;

// replaceLangPlaceholder :: (String, String, String) -> String
const replaceLangPlaceholder = (placeholder, insert, template) => template.replace(bracesWrap(placeholder), insert); 

// renderer :: Object -> Function 
const render = (a) => R.compose(R.apply(R.compose), R.map(R.partial(replaceLangPlaceholder)))(R.toPairs(a))

//const insertDict = () => {text:"", attr:"", alt:""};

/* Insertion  */
const insertElement = (editor, lang_elem) => editor.insert(


exports.element_insert = function (editor, lang_elem) {
    return function () {

            editor.insert(render({text:editor.getSelectedText()})(lang_elem.template));

            editor.focus();
        };
    };
