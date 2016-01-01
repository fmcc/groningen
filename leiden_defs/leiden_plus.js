
leiden_plus_translation = {
    name: "Leiden+ translation", 
    type: "translation_epidoc",
    elements: [
    {
        name: "translation", 
        template:"<T={attr}\n\t{text}\n=T>",
        attr: [".en",".de"]
    },
    {
        name: "div",
        template:"<D={attr}\n\t{text}\n=D>",
        attr: [".1.folio", ".r", ".v"],
        class: "btn-danger",
    },
    {
        name: "p",
        template: "<=\n\t{text}\n=>",
    },
    {
        name: "line_number",
        template: "(({text}))",
    },
    {
        name: "supplied",
        template: "[{text}]"
    },
    {
        name: "note",
        template: "/*{attr}|{text}*/",
        attr: ["tribe","footnote","inline"]
    },
    {
        name: "choice",
        template: "<:{alt}|alt|{text}:>"
    },
    {
        name: "transliteration",
        template: "<{alt}{attr}={text}>",
        attr: ["~grc-Latn"]
    },
    {
        name: "gap", 
        template: "..."
    },
    ]
}

