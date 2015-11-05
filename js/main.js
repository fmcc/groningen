var $ = require('jquery');
var R = require('ramda');
var ace = require('brace');

window.R = R;

require('brace/mode/javascript');
require('brace/theme/dawn');
require('brace/ext/language_tools');

var l_p = require('./leiden_plus.js');
var ui = require('./ui.js')

var editor = ace.edit('leiden-plus-editor');
ui.createUI(editor, $('#leiden-plus-control'), l_p);

editor.setOptions({ 
    fontSize: 16,
    maxLines: 200,
    showPrintMargin: false,
    theme: 'ace/theme/dawn',
    wrapBehavioursEnabled: true, 
});

session = editor.getSession();
session.setUseWrapMode(true);
session.setWrapLimitRange();

editor.setValue("<T=.en <D= <=\r\n...\r\n...\r\n...\r\n... of the ...\r\n((5)) ... the People shall elect\r\nstraightaway ten men from all the Athenians and five from the Council;\r\nand those elected shall - in the Eleusinion in the city\r\n... of the <sacred tract=hieras orgados>/*footnote|1*/\r\n... from neither favour nor\r\n((10)) enmity ... but as justly and piously as possible\r\n... from the sixteenth of Posideon/*footnote|2*/\r\n... in the archonship of Aristodemos (352/1); and there shall be present\r\nthe <king=basilea> and the hierophant and the <torchbearer=dadouchon>/*footnote|3*/\r\nand the Kerykes and the Eumolpidai and any other Athenian who\r\n((15)) wishes, so that they may place the <markers=horous> as piously and justly as possible;\r\nand there shall have oversight of the <sacred tract=hieras orgados> and the other\r\n[<sacred precincts=hierōn temenōn>] at Athens from this day for\r\nall time those whom the law requires for each of them and\r\nthe Council of the Areopagos and the general\r\n((20)) elected for the <protection=phulakēn> of the <country=chōras> and the <patrol commanders=peripolarchous>\r\nand the demarchs and the Council in office at any time\r\nand any other Athenian who wishes, in whatever way\r\nthey know how; and the secretary of the Council shall write on two\r\npieces of tin, equal and alike, on the one, if it is preferable and better\r\n((25)) for the Athenian People that the <king=basilea>/*footnote|4*/ lets out the\r\narea of the <sacred tract=hieras orgados> which is now being worked [<:out|alt|in:>]side the <markers=horōn>\r\nfor <building=oikodomian> the <portico=prostōiou> and <repair=episkeuēn> of the <sanctuary=hierou> of the two goddesses;/*footnote|5*/\r\n=> =D> =T>", -1);
