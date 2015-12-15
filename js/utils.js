var $ = require('jquery');
var R = require('ramda');

// ajaxCORSPost :: (String, Function, Function) => String
const ajaxCORSPost = (u, s, e) => (d) => $.ajax({url:u, type:"POST", crossDomain:true, data:d, dataType:"json", success:s, error:e});

// 
const toList = R.ifElse(R.is(Array), R.identity, R.of);

exports.ajaxCORSPost = ajaxCORSPost;
exports.toList = toList;
