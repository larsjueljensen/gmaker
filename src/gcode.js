// Generated automatically by nearley, version 2.13.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


let numberedParams = {
    3: 45
};

const lexer = moo.compile({
    comment: /;.*$|\(.*?\)/,
    expstart: /\[/,
    expend: /\]/,
    paramstart: '#',
    equals: "=",
    operator: /\*\*|\+|\-|\*|\/|OR|XOR|AND|MOD|EQ|NE|GT|GE|LT|LE/,
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

function empty(d) {
    return null;
}

function logid(prefix) {
    return function (d) {
        console.log(prefix, d);
        return d;
    };
}

// Appends to list
function append(d) {
    if (Array.isArray(d[0])) {
        return d[0].concat(d[2]);
    }
    return [d[0], d[2]];
}

function getparam(d) {
    return numberedParams[String(d[1])] | 0.0;
}

// Returns the result of one parsed line
function processLine(d) {

    //logid("processLine")(d);

    if (d[0] != null) {
        return [];
    }

    if (d[2] != null) {
        return [d[2]].concat(d[4]);
    }

    if (! Array.isArray(d[4])) {
        return [d[4]];
    }

    return d[4];
}


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
    {"name": "line", "symbols": ["line$ebnf$1", "line$ebnf$2", "line_items", "EOL"], "postprocess": processLine},
    {"name": "block_delete", "symbols": [{"literal":"/"}], "postprocess": id},
    {"name": "linenumber", "symbols": ["_", (lexer.has("linenumber_command") ? {type: "linenumber_command"} : linenumber_command), "int_or_float", "_"], "postprocess": function (d) { return {command: d[1].value, value: d[2]}; }},
    {"name": "line_items", "symbols": ["line_item"], "postprocess": id},
    {"name": "line_items", "symbols": ["line_items", "_", "line_item"], "postprocess": append},
    {"name": "line_item", "symbols": ["comment"], "postprocess": id},
    {"name": "line_item", "symbols": ["parameter_setting"], "postprocess": id},
    {"name": "line_item", "symbols": ["word"], "postprocess": id},
    {"name": "word", "symbols": [(lexer.has("command") ? {type: "command"} : command), "_", "number"], "postprocess": function (d) { return {command: d[0].value, value: d[2]}; }},
    {"name": "parameter_start", "symbols": [(lexer.has("paramstart") ? {type: "paramstart"} : paramstart)], "postprocess": id},
    {"name": "parameter_setting", "symbols": ["parameter_start", "parameter_index", "_", (lexer.has("equals") ? {type: "equals"} : equals), "_", "number"], "postprocess": function (d) { return {command: d[0].value + d[1], value: d[5]}; }},
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": function (d) { return {command: 'COMMENT', value: d[0].value}; }},
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
    {"name": "primary", "symbols": ["parameter_expression"], "postprocess": id},
    {"name": "parameter_expression", "symbols": ["parameter_start", "parameter_index"], "postprocess": getparam},
    {"name": "parameter_index", "symbols": ["int"], "postprocess": id},
    {"name": "parameter_index", "symbols": ["gcode_expression"], "postprocess": id},
    {"name": "parameter_index", "symbols": ["parameter_expression"], "postprocess": id},
    {"name": "int_or_float", "symbols": ["int"], "postprocess": id},
    {"name": "int_or_float", "symbols": ["float"], "postprocess": id},
    {"name": "int", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": (d) => parseInt(d[0])},
    {"name": "float", "symbols": [(lexer.has("float") ? {type: "float"} : float)], "postprocess": (d) => parseFloat(d[0])},
    {"name": "EOL", "symbols": [(lexer.has("EOL") ? {type: "EOL"} : EOL)], "postprocess": empty}
]
  , ParserStart: "line"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
