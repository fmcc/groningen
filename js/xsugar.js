var R = require('ramda');

var utils = require('./utils.js');
var ed_tools = require('./editor_tools.js');

// xsugarPostData :: (String, String) => String => Object
const xsugarPostData = (dir, type) => data => {return {content: data, direction: dir, type: type}};

// getException :: Object xsugarResponse -> Object xsugarException
const getException = R.prop('exception');

// getContent :: Object xsugarResponse -> String
const getContent = R.prop('content');

// toAceAnnotation :: Object xsugarException -> Object aceAnnotation
const toAceAnnotation = (e) => { return {column:e.column, raw:e.cause, row:e.line-1, text:e.cause, type:"error"}};

// toAceAnnotations :: [Object xsugarException] -> [Object aceAnnotation]
const toAceAnnotations = (a) => R.map(toAceAnnotation, utils.toList(a))

const transLeidentoEpidoc = xsugarPostData("nonxml2xml","translation_epidoc"); 
const epidoctoTransLeiden = xsugarPostData("xml2nonxml","translation_epidoc"); 

const leidentoEpidoc = xsugarPostData("nonxml2xml","epidoc"); 
const epidoctoLeiden = xsugarPostData("xml2nonxml","epidoc"); 

const xsugarXMLinSplit = env => r => ed_tools.openTextInSplit(env)(getContent(r));

const setResponseErrors = ed => R.compose(ed_tools.setAnnotations(ed), toAceAnnotations, getException);

const formatResponse = e => R.ifElse(R.has('exception'), setResponseErrors(e.editor), xsugarXMLinSplit(e));

const logIt = a => console.log(a);

const convertForSplit = (url, env) => t => utils.ajaxCORSPost(url, formatResponse(env), logIt)(transLeidentoEpidoc(t))

exports.convertForSplit = convertForSplit;
//const commentarytoEpidoc = xsugarPostData("nonxml2xml","commentary"); 
//const epidoctoCommentary = xsugarPostData("xml2nonxml","commentary"); 

/*
Request Parameters:
* `content`: contains the XML or Leiden+
* `type`: contains a string identifying the XSugar grammar to use (so we
  can use this for e.g. translation Leiden as well)
* `direction`: `xml2nonxml` or `nonxml2xml`
*/

