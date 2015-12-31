# Groningen
A configurable browser-based editor library for projects working with the Leiden+ syntax.

![Short example of autocompletion and conversion to Epidoc.](/assets/autocompletion_and_conversion.gif?raw=true)

## Getting started

Groningen bundles the Ace Editor along with other dependencies, so all that is required to use the library is to include the packaged javascript file (found at `./dist/groningen.js` in this repo) in the web page, and initialise the editor with all required options. 

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

## Configuration 

The following configuration options can be defined when initialising the Groningen editor.  

* `editor_container` - ID of a \<div\> which will be replaced by the editor. (String) 
* `xsugar_url` - URL of the xsugar endpoint to be used for conversion to Epidoc XML. (String) 
* `language_definition` - The language definition object described below. (Object)

As Groningen is based on the Ace Editor library, the  `editor_container` element must have at least one explicit dimension and be positioned either relatively or absolutely, otherwise the editor will not be initialised, e.g.: 

```css
#editor {
    position: relative;
    height: 600px;
}
```

* `leiden_output` - ID of a \<textarea\> which the Leiden editor will be synchronised with. (String - optional)
* `epidoc_output` - ID of a \<textarea\> which the Epidoc editor will be synchronised with. (String - optional)
* `ui_container` - ID of a \<div\> to which ui elements will be appended. (String - optional)
* `ui_button` - HTML attribute object that will act as a mixin for all buttons generated for the ui. See [jQuery documentation](http://api.jquery.com/jQuery/#jQuery-html-attributes). Most useful for specifying default classes. (Object - optional)

## Language definition 

The majority of features of the editor are derived from a relatively simple language definition. 

### Elements 

A language element can have the following components:

* `name` - Used to construct UI elements and as label in highlighting tokeniser. (String)
* `template` - A template with a few potential placeholder values defining the invariant aspects of the language element (see below). (String) 
* `attr` - Array of potential attribute strings for this language element. (\[String\] - optional)
* `class` - Classes (space separated) to apply to the associated UI elements. (String - optional)

Strings that are defined as attributes, e.g. ` attr: ["tribe","footnote","inline"]`

#### Template

These templates can contain three placeholder values: 
* `{text}` - The main text contained within a language element. 
* `{attr}` - Attributes defined for this language element. 
* `{alt}` - Alternate text contained within a language element. 

```javascript
{
    name: "translation", 
    template:"<T={attr}\n\t{text}\n=T>",
    attr: [".en",".de"]
},
```
If a language element does not contain any of these placeholder values it is treated as a language constant, e.g.  

```javascript
{
    name: "gap", 
    template: "..."
}
```
