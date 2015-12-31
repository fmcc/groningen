# Groningen
A configurable browser-based editor library for projects working with the Leiden+ syntax.

![Short example of autocompletion and conversion to Epidoc.](/assets/autocompletion_and_conversion.gif?raw=true)


```javascript
var G = Groningen({
    editor_container: "editor",
    language_definition: lang_def,
    leiden_output: "leiden-output",
    epidoc_output: "epidoc-output",
    ui_container: "editor-ui",
    ui_button: {class:'btn btn-default btn-sm'},
    xsugar_url: "http://libdc3-dev-03.oit.duke.edu/xsugar/",
});
```

The following configuration options can be defined when initialising the Groningen editor.  

* `editor_container` - ID of a \<div\> which will be replaced by the editor. (String) 
* `xsugar_url` - URL of the xsugar endpoint to be used for conversion to Epidoc XML. (String) 
* `language_definition` - The language definition object described below. (Object)

* `leiden_output` - ID of a \<textarea\> which the Leiden editor will be synchronised with. (String - optional)
* `epidoc_output` - ID of a \<textarea\> which the Epidoc editor will be synchronised with. (String - optional)
* `ui_container` - ID of a \<div\> to which ui elements will be appended. (String - optional)
* `ui_button` - HTML attribute object that will act as a mixin for all buttons generated for the ui. See [jQuery documentation](http://api.jquery.com/jQuery/#jQuery-html-attributes). Most useful for specifying default classes. (Object - optional)

## Language definition 

The majority of features of the editor are derived from a relatively simple language definition. 

Templates for language elements can

These templates can contain three placeholder values: 
* `{text}` - The main text contained within a language element. 
* `{attr}` - Attributes defined for this language element. 
* `{alt}` - Alternate text contained within a language element. 

If a language element does not contain any of these placeholder values it is treated as a language constant. 

Strings that are defined as attributes, e.g. ` attr: ["tribe","footnote","inline"]`


```javascript
{
    name: "translation", 
    template:"<T={attr}\n\t{text}\n=T>",
    attr: [".en",".de"]
},
{
    name: "gap", 
    template: "..."
},
```

## Language definition 

