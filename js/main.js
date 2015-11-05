var $ = require('jquery');
var R = require('ramda');
window.R = R;

var ace = require('brace');

require('brace/mode/javascript');
require('brace/theme/monokai');
var l_p = require('./leiden_plus.js');
var ui = require('./ui.js')
// Initialise the editor
var editor = ace.edit('leiden-plus-editor');
// Initialise the additional controls
ui.createUI(editor, $('#leiden-plus-control'), l_p);

editor.setTheme('ace/theme/monokai');
editor.setFontSize(16);
editor.setShowPrintMargin(false);

ace.config.set("basePath", "./js");
editor.getSession().setMode('./highlight');

editor.setValue("<T=<D=<=\r\n...\r\n...\r\n...\r\n... of the ...\r\n((5)) ... the People shall elect\r\nstraightaway ten men from all the Athenians and five from the Council;\r\nand those elected shall - in the Eleusinion in the city\r\n... of the <sacred tract=hieras orgados>/*footnote|1*/\r\n... from neither favour nor\r\n((10)) enmity ... but as justly and piously as possible\r\n... from the sixteenth of Posideon/*footnote|2*/\r\n... in the archonship of Aristodemos (352/1); and there shall be present\r\nthe <king=basilea> and the hierophant and the <torchbearer=dadouchon>/*footnote|3*/\r\nand the Kerykes and the Eumolpidai and any other Athenian who\r\n((15)) wishes, so that they may place the <markers=horous> as piously and justly as possible;\r\nand there shall have oversight of the <sacred tract=hieras orgados> and the other\r\n[<sacred precincts=hierōn temenōn>] at Athens from this day for\r\nall time those whom the law requires for each of them and\r\nthe Council of the Areopagos and the general\r\n((20)) elected for the <protection=phulakēn> of the <country=chōras> and the <patrol commanders=peripolarchous>\r\nand the demarchs and the Council in office at any time\r\nand any other Athenian who wishes, in whatever way\r\nthey know how; and the secretary of the Council shall write on two\r\npieces of tin, equal and alike, on the one, if it is preferable and better\r\n((25)) for the Athenian People that the <king=basilea>/*footnote|4*/ lets out the\r\narea of the <sacred tract=hieras orgados> which is now being worked [<:out|alt|in:>]side the <markers=horōn>\r\nfor <building=oikodomian> the <portico=prostōiou> and <repair=episkeuēn> of the <sanctuary=hierou> of the two goddesses;/*footnote|5*/\r\n=>=D>=T>", -1);

//editor.setValue("<T=.en <D=.1.folio <D=.r <= ((1)) Payment likewise on Thoth 29.  Page 2. ---- 2. Minos son of Pis   3 ½ car.  3,300 tal.");

var url = "/stupid/";
var data = {content: editor.getValue(), direction: "nonxml2xml", type:"translation_epidoc"};

// parseException :: xsugarResponse -> xsugarException
const parseException = R.partial(R.prop, ['exception']);

// toAceAnnotation :: xsugarException -> aceAnnotation
const toAceAnnotation = (e) => { return {column:e.column, raw:e.cause, row:e.line, text:e.cause, type:"error"}};

const setAnnotations = (editor, annotations) => editor.getSession().setAnnotations([annotations]);

const aye = R.compose(R.partial(setAnnotations, [editor]), toAceAnnotation, parseException);

//$.post(url,data, function(data) {aye(data)});// data, function (data){console.log(data);});

module.exports = editor
