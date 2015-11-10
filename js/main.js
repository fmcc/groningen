var $ = require('jquery');
var R = require('ramda');
var ace = require('brace');

window.R = R;

require('brace/mode/javascript');
require('brace/theme/dawn');
require('brace/ext/split.js');

var Split = ace.acequire("ace/ext/split").Split;

var l_p = require('./leiden_plus.js');
var ui = require('./ui.js')

var container = document.getElementById("leiden-plus-editor");
var theme = ace.acequire("ace/theme/dawn");

var env = {};

var split = new Split(container, theme, 1);
env.editor = split.getEditor(0);

split.on("focus", function(editor) {
    env.editor = editor;
    //updateUIEditorOptions();
});

env.split = split;
window.env = env;

ui.createUI(env.editor, $('#leiden-plus-control'), l_p);

env.editor.setOptions({ 
    fontSize: 16,
    maxLines: 200,
    showPrintMargin: false,
    theme: 'ace/theme/dawn',
    wrapBehavioursEnabled: true, 
    showInvisibles: true,
});

session = env.editor.getSession();
session.setUseWrapMode(true);
session.setWrapLimitRange();

env.editor.setValue("<T=.en <D= <=\r\n...\r\n...\r\n...\r\n... of the ...\r\n((5)) ... the People shall elect\r\nstraightaway ten men from all the Athenians and five from the Council;\r\nand those elected shall - in the Eleusinion in the city\r\n... of the <sacred tract=hieras orgados>/*footnote|1*/\r\n... from neither favour nor\r\n((10)) enmity ... but as justly and piously as possible\r\n... from the sixteenth of Posideon/*footnote|2*/\r\n... in the archonship of Aristodemos (352/1); and there shall be present\r\nthe <king=basilea> and the hierophant and the <torchbearer=dadouchon>/*footnote|3*/\r\nand the Kerykes and the Eumolpidai and any other Athenian who\r\n((15)) wishes, so that they may place the <markers=horous> as piously and justly as possible;\r\nand there shall have oversight of the <sacred tract=hieras orgados> and the other\r\n[<sacred precincts=hierōn temenōn>] at Athens from this day for\r\nall time those whom the law requires for each of them and\r\nthe Council of the Areopagos and the general\r\n((20)) elected for the <protection=phulakēn> of the <country=chōras> and the <patrol commanders=peripolarchous>\r\nand the demarchs and the Council in office at any time\r\nand any other Athenian who wishes, in whatever way\r\nthey know how; and the secretary of the Council shall write on two\r\npieces of tin, equal and alike, on the one, if it is preferable and better\r\n((25)) for the Athenian People that the <king=basilea>/*footnote|4*/ lets out the\r\narea of the <sacred tract=hieras orgados> which is now being worked [<:out|alt|in:>]side the <markers=horōn>\r\nfor <building=oikodomian> the <portico=prostōiou> and <repair=episkeuēn> of the <sanctuary=hierou> of the two goddesses;/*footnote|5*/\r\n=> =D> =T>", -1);


// twoSplit :: Object AceSplit => Boolean
const twoSplits = (split) => (split.getSplits() == 2 ? true : false);

// setSplit :: Int => Object AceSplit => IO DOM
const setSplit = n => split => split.setSplits(n);

// toggleSplit :: Object AceSplit => IO DOM
const toggleSplit = R.ifElse(twoSplits, setSplit(1), setSplit(2));

// ajaxCORSPost :: (String, Function, Function) => String
const ajaxCORSPost = (u, s, e) => (d) => $.ajax({url:u, type:"POST", crossDomain:true, data:d, dataType:"json", success:s, error:e});

// xsugarPostData :: (String, String) => String => Object
const xsugarPostData = (dir, type) => data => { return {content: data, direction: dir, type: type}};

const translationLPtoED = xsugarPostData("nonxml2xml","translation_epidoc"); 

// getException :: Object xsugarResponse -> Object xsugarException
const getException = R.prop('exception');

// getContent :: Object xsugarResponse -> String
const getContent = R.prop('content');

// toAceAnnotation :: Object xsugarException -> Object aceAnnotation
const toAceAnnotation = (e) => { return {column:e.column, raw:e.cause, row:e.line-1, text:e.cause, type:"error"}};

//
const toList = R.ifElse(R.is(Array), R.identity, R.of);

// 
const setAnnotations = editor => annotations => editor.getSession().setAnnotations(annotations);

const logIt = (d) => console.log(d);

const toAceAnnotations = (a) => R.map(toAceAnnotation, toList(a))


const setResponseErrors = R.compose(setAnnotations(env.editor), toAceAnnotations, getException);

const openXMLInSplit = (t) => [toggleSplit(env.split), setEditorText(env.split.$editors[1])(getContent(t))];

const formatResponse = R.ifElse(R.has('exception'), setResponseErrors, openXMLInSplit);

const setEditorText = ed => t => ed.setValue(t);

/*
Request Parameters:
* `content`: contains the XML or Leiden+
* `type`: contains a string identifying the XSugar grammar to use (so we
  can use this for e.g. translation Leiden as well)
* `direction`: `xml2nonxml` or `nonxml2xml`
*/

var dc3_xsugar_url = "http://libdc3-dev-03.oit.duke.edu/xsugar/";

var good_text = "<T=.en <D=.1.folio <D=.r <= ((1)) Payment likewise on Thoth 29.  Page 2. => =D> =D> =T>";
var bad_text = "<T=.en <D= <= A wee test => =D> =T>"; 


ajaxCORSPost(dc3_xsugar_url, formatResponse, logIt)(translationLPtoED(good_text)); 
