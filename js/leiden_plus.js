
module.exports = {
    name: "Leiden+ translation", 
    elements: [
    {
        name: "translation", 
        template:"<T={attr}{text}=T>",
        attr: [".en",".de"]
    },
    {
        name: "div",
        template:"<D={attr}{text}=D>"
    },
    {
        name: "p",
        template: "<={text}=>",
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
        template: "/*{attr}{text}*/",
        attr: ["tribe|","footnote|","inline|"]
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

