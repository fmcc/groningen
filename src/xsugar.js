var R = require('ramda');

var ed_tools = require('./editor_tools.js');

// ajaxCORSPost :: (String, Function, Function) => String
const ajaxCORSPost = (u, s, e) => (d) => $.ajax({url:u, type:"POST", crossDomain:true, data:d, dataType:"json", success:s, error:e});

// toList :: a || [a] => [a] 
const toList = R.ifElse(R.is(Array), R.identity, R.of);

// xsugarPostData :: (String, String) => String => Object
const xsugarPostData = (dir, type) => data => {return {content: data, direction: dir, type: type}};

// getException :: Object xsugarResponse -> Object xsugarException
const getException = R.prop('exception');

// getContent :: Object xsugarResponse -> String
const getContent = R.prop('content');

// toAceAnnotation :: Object xsugarException -> Object aceAnnotation
const toAceAnnotation = (e) => { return {column:e.column, raw:e.cause, row:e.line-1, text:e.cause, type:"error"}};

// toAceAnnotations :: [Object xsugarException] -> [Object aceAnnotation]
const toAceAnnotations = (a) => R.map(toAceAnnotation, toList(a))

const xsugarXMLinSplit = env => r => ed_tools.openEpidocInSplit(env)(getContent(r));

const setResponseErrors = ed => R.compose(ed_tools.setAnnotations(ed), toAceAnnotations, getException);

const formatResponse = e => R.ifElse(R.has('exception'), setResponseErrors(e.leiden_editor), xsugarXMLinSplit(e));

const logIt = a => console.log(a); 

const convertForSplit = (url, type, env) => t => ajaxCORSPost(url, formatResponse(env), logIt)(xsugarPostData('nonxml2xml', type)(t))

exports.convertForSplit = convertForSplit;

/*
Request Parameters:
* `content`: contains the XML or Leiden+
* `type`: contains a string identifying the XSugar grammar to use (so we
  can use this for e.g. translation Leiden as well)
* `direction`: `xml2nonxml` or `nonxml2xml`
*/
