
// hasProperty :: Object -> String -> Bool 
//var hasProperty = (obj, prop_name) => (prop_name in obj);

// hasProps :: [String] -> Object -> Bool
const hasProps = (props, obj) => R.all(R.has(R.__,obj), props)
//var hasProperties = (obj, prop_names) => R.all(R.partial(hasProperty, [obj]))(prop_names);

aye = [[['start','mid', 'end'], "complex"],
[['start','end'], "pair"],
[['elem'], "standalone"]]

R.map(R.compose(R.partial, hasProperties, R.head), aye);

// getElementType :: langElement -> elementType
function getElementType (lang_elem) {
    R.partial(hasProperties, lang_elem);
    if (hasProperties(['start','end','mid'], langElement)) {

}
