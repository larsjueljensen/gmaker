// Generated automatically by nearley, version 2.13.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("moo").compile({
    expstart: /\[/,
    expend: /\]/,
    operator: /\*\*|[\+\-\*\/]|OR|XOR|AND|MOD|EQ|NE|GT|GE|LT|LE/,
    function: ['ATAN','ABS','ACOS','ASIN','COS','EXP','FIX','FUP','ROUND','LN','SIN','SQRT','TAN','EXISTS'],
    linenumber_command: 'N',
    command: /[ABCDFGHIJKLMPQRSTUVWXYZ]/,
    float: /[0-9]*\.[0-9]+/,
    int: /[0-9]+/,
    ws: /[ \t]+/,
    EOL: {match: /(?:\r\n?|\n)/, lineBreaks: true }
});

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function empty(d) { return null; };
function append(d) {
    if (Array.isArray(d[0])) {
        return d[0].concat(d[2]);
    }
    return [d[0], d[2]];
};

function processLine(d) {

    if (d[0] != null) {
        return [];
    }

    if (d[2] != null) {
        return [d[2]].concat(d[3]);
    }

    return d[3];
}
function logid(d) {
    console.log(d);
    return d;
}

let numberedParams = {};

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "line$ebnf$1", "symbols": ["block_delete"], "postprocess": id},
    {"name": "line$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "line$ebnf$2", "symbols": ["linenumber"], "postprocess": id},
    {"name": "line$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "line", "symbols": ["line$ebnf$1", "_", "line$ebnf$2", "words", "EOL"], "postprocess": processLine},
    {"name": "words", "symbols": ["word"], "postprocess": id},
    {"name": "words", "symbols": ["words", "_", "word"], "postprocess": append},
    {"name": "block_delete", "symbols": [{"literal":"/"}], "postprocess": id},
    {"name": "EOL", "symbols": [(lexer.has("EOL") ? {type: "EOL"} : EOL)], "postprocess": empty},
    {"name": "linenumber", "symbols": [(lexer.has("linenumber_command") ? {type: "linenumber_command"} : linenumber_command), "int_or_float"], "postprocess": function (d) { return {command: d[0].value, value: d[1]}; }},
    {"name": "word", "symbols": [(lexer.has("command") ? {type: "command"} : command), "_", "number"], "postprocess": function (d) { return {command: d[0].value, value: d[2]}; }},
    {"name": "gcode_expression", "symbols": [{"literal":"["}, "_", "expression", "_", {"literal":"]"}], "postprocess": (d) => d[2]},
    {"name": "expression", "symbols": ["logical_expression"], "postprocess": id},
    {"name": "logical_expression", "symbols": ["comparative_expression"], "postprocess": id},
    {"name": "logical_expression", "symbols": ["logical_expression", "_", {"literal":"AND"}, "_", "comparative_expression"], "postprocess": (d) => d[0] && d[4]},
    {"name": "logical_expression", "symbols": ["logical_expression", "_", {"literal":"OR"}, "_", "comparative_expression"], "postprocess": (d) => d[0] || d[4]},
    {"name": "logical_expression", "symbols": ["logical_expression", "_", {"literal":"XOR"}, "_", "comparative_expression"], "postprocess": (d) => ((d[0] && !d[4]) || (!d[0] && d[4]))},
    {"name": "comparative_expression", "symbols": ["additive_expression"], "postprocess": id},
    {"name": "comparative_expression", "symbols": ["comparative_expression", "_", {"literal":"EQ"}, "_", "additive_expression"], "postprocess": (d) => d[0] == d[4]},
    {"name": "comparative_expression", "symbols": ["comparative_expression", "_", {"literal":"NE"}, "_", "additive_expression"], "postprocess": (d) => d[0] != d[4]},
    {"name": "comparative_expression", "symbols": ["comparative_expression", "_", {"literal":"GT"}, "_", "additive_expression"], "postprocess": (d) => d[0] > d[4]},
    {"name": "comparative_expression", "symbols": ["comparative_expression", "_", {"literal":"GE"}, "_", "additive_expression"], "postprocess": (d) => d[0] >= d[4]},
    {"name": "comparative_expression", "symbols": ["comparative_expression", "_", {"literal":"LT"}, "_", "additive_expression"], "postprocess": (d) => d[0] < d[4]},
    {"name": "comparative_expression", "symbols": ["comparative_expression", "_", {"literal":"LE"}, "_", "additive_expression"], "postprocess": (d) => d[0] <= d[4]},
    {"name": "additive_expression", "symbols": ["multiplicative_expression"], "postprocess": id},
    {"name": "additive_expression", "symbols": ["additive_expression", "_", {"literal":"+"}, "_", "multiplicative_expression"], "postprocess": (d) => d[0] + d[4]},
    {"name": "additive_expression", "symbols": ["additive_expression", "_", {"literal":"-"}, "_", "multiplicative_expression"], "postprocess": (d) => d[0] - d[4]},
    {"name": "multiplicative_expression", "symbols": ["power_expression"], "postprocess": id},
    {"name": "multiplicative_expression", "symbols": ["multiplicative_expression", "_", {"literal":"*"}, "_", "power_expression"], "postprocess": (d) => d[0] * d[4]},
    {"name": "multiplicative_expression", "symbols": ["multiplicative_expression", "_", {"literal":"/"}, "_", "power_expression"], "postprocess": (d) => d[0] / d[4]},
    {"name": "multiplicative_expression", "symbols": ["multiplicative_expression", "_", {"literal":"MOD"}, "_", "power_expression"], "postprocess": (d) => d[0] % d[4]},
    {"name": "power_expression", "symbols": ["function_expression"], "postprocess": id},
    {"name": "power_expression", "symbols": ["power_expression", "_", {"literal":"**"}, "_", "function_expression"], "postprocess": (d) => Math.pow(d[0], d[4])},
    {"name": "function_expression", "symbols": ["number"], "postprocess": id},
    {"name": "function_expression", "symbols": [{"literal":"ATAN"}, "_", "gcode_expression", "_", {"literal":"/"}, "_", "gcode_expression"], "postprocess": (d) => Math.degrees(Math.atan(d[2], d[6]))},
    {"name": "function_expression", "symbols": [{"literal":"ABS"}, "_", "gcode_expression"], "postprocess": (d) => Math.abs(d[2])},
    {"name": "function_expression", "symbols": [{"literal":"ACOS"}, "_", "gcode_expression"], "postprocess": (d) => Math.degrees(Math.acos(d[2]))},
    {"name": "function_expression", "symbols": [{"literal":"ASIN"}, "_", "gcode_expression"], "postprocess": (d) => Math.degrees(Math.asin(d[2]))},
    {"name": "function_expression", "symbols": [{"literal":"COS"}, "_", "gcode_expression"], "postprocess": (d) => Math.cos(Math.radians(d[2]))},
    {"name": "function_expression", "symbols": [{"literal":"EXP"}, "_", "gcode_expression"], "postprocess": (d) => Math.exp(d[2])},
    {"name": "function_expression", "symbols": [{"literal":"FIX"}, "_", "gcode_expression"], "postprocess": (d) => Math.floor(d[2])},
    {"name": "function_expression", "symbols": [{"literal":"FUP"}, "_", "gcode_expression"], "postprocess": (d) => Math.ceil(d[2])},
    {"name": "function_expression", "symbols": [{"literal":"ROUND"}, "_", "gcode_expression"], "postprocess": (d) => Math.round(d[2])},
    {"name": "function_expression", "symbols": [{"literal":"LN"}, "_", "gcode_expression"], "postprocess": (d) => Math.log(d[2])},
    {"name": "function_expression", "symbols": [{"literal":"SIN"}, "_", "gcode_expression"], "postprocess": (d) => Math.sin(Math.radians(d[2]))},
    {"name": "function_expression", "symbols": [{"literal":"SQRT"}, "_", "gcode_expression"], "postprocess": (d) => Math.sqrt(d[2])},
    {"name": "function_expression", "symbols": [{"literal":"TAN"}, "_", "gcode_expression"], "postprocess": (d) => Math.tan(d[2])},
    {"name": "function_expression", "symbols": [{"literal":"EXISTS"}, "_", "gcode_expression"], "postprocess": (d) => Math.cos(d[2])},
    {"name": "number", "symbols": ["primary"], "postprocess": id},
    {"name": "number", "symbols": ["_", {"literal":"-"}, "number"], "postprocess": (d) => d[2] * -1},
    {"name": "number", "symbols": ["_", {"literal":"+"}, "number"], "postprocess": (d) => d[2] * 1},
    {"name": "primary", "symbols": ["int_or_float"], "postprocess": id},
    {"name": "primary", "symbols": ["gcode_expression"], "postprocess": id},
    {"name": "int_or_float", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": (d) => parseInt(d[0])},
    {"name": "int_or_float", "symbols": [(lexer.has("float") ? {type: "float"} : float)], "postprocess": (d) => parseFloat(d[0])}
]
  , ParserStart: "line"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
