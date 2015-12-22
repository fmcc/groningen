var $ = require('jquery');
var R = require('ramda');

// ajaxCORSPost :: (String, Function, Function) => String
const ajaxCORSPost = (u, s, e) => (d) => $.ajax({url:u, type:"POST", crossDomain:true, data:d, dataType:"json", success:s, error:e});

// 
const toList = R.ifElse(R.is(Array), R.identity, R.of);

const pairProduct = a => R.xprod(toList(a[0]), toList(a[1]));

exports.ajaxCORSPost = ajaxCORSPost;
exports.toList = toList;
exports.pairProduct = pairProduct;
