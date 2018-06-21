
const lexer = require("moo").compile({
    expstart: /\[/,
    expend: /\]/,
    paramstart: '#',
    operator: /\*\*|\+|\-|\*|\/|OR|XOR|AND|MOD|EQ|NE|GT|GE|LT|LE/,
    function: ['ATAN','ABS','ACOS','ASIN','COS','EXP','FIX','FUP','ROUND','LN','SIN','SQRT','TAN','EXISTS'],
    linenumber_command: 'N',
    command: /[ABCDFGHIJKLMPQRSTUVWXYZ]/,
    float: /[0-9]*\.[0-9]+/,
    int: /[0-9]+/,
    ws: /[ \t]+/,
    EOL: {match: /(?:\r\n?|\n)/, lineBreaks: true }
});

lexer.reset("X[#45]\n");
console.log(lexer.next());
console.log(lexer.next());
console.log(lexer.next());
console.log(lexer.next());
