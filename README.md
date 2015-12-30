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

An
