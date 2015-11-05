var R = require('ramda');

// parseException :: xsugarResponse -> xsugarException
const parseException = R.prop('exception');

// toAceAnnotation :: xsugarException -> aceAnnotation
const toAceAnnotation = (e) => { return {column:e.column, raw:e.cause, row:e.line, text:e.cause, type:"error"}};

const setAnnotations = (editor, annotations) => editor.getSession().setAnnotations([annotations]);

/* Template formatting */
// bracesWrap :: String -> String
const bracesWrap = (x) => `{${x}}`;

// replaceLangPlaceholder :: (String, String, String) -> String
const replaceLangPlaceholder = (placeholder, insert, template) => template.replace(bracesWrap(placeholder), insert); 

// renderer :: Object -> Function 
const render = (a) => R.compose(R.apply(R.compose), R.map(R.partial(replaceLangPlaceholder)))(R.toPairs(a))

//const insertDict = () => {text:"", attr:"", alt:""};

/* Insertion  */
//const insertElement = (editor, lang_elem) => editor.insert(

exports.element_insert = function (editor, lang_elem) {
    return function () {
            editor.insert(render({text:editor.getSelectedText(), attr:lang_elem.attr})(lang_elem.template));
            editor.focus();
        };
    };
