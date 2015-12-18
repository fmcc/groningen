
leiden_plus_translation = {
    name: "Leiden+ translation", 
    elements: [
    {
        name: "translation", 
        template:"<T={attr}\n{text}\n=T>",
        attr: [".en",".de"]
    },
    {
        name: "div",
        template:"<D={attr}\n{text}\n=D>",
        attr: [".folio"]
    },
    {
        name: "p",
        template: "<=\n{text}\n=>",
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
    }
    ]
}

