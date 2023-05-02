// Monarch syntax highlighting for the logik language.
export default {
    keywords: [
        'X','x'
    ],
    operators: [
        '\'','*','+',';','='
    ],
    symbols:  /'|\(|\)|\*|\+|;|=/,

    tokenizer: {
        initial: [
            { regex: /[_a-zA-Z0-9][\w_]*/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { regex: /[0-1]+/, action: {"token":"number"} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /\s+/, action: {"token":"white"} },
            { regex: /\/\*/, action: {"token":"comment","next":"@comment"} },
            { regex: /\/\/.*$/, action: {"token":"comment"} },
            { regex: /\#.*$/, action: {"token":"comment"} }
            
        ],
        comment: [
            { regex: /[^\/\*]+/, action: {"token":"comment"} },
            { regex: /\*\//, action: {"token":"comment","next":"@pop"} },
            { regex: /[\/\*]/, action: {"token":"comment"} },
        ]
    }
};
