@builtin "whitespace.ne"

@{%

let numberedParams = {
    3: 45
};

const lexer = moo.compile({
    comment: /\(.*?\)/,
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
    return numberedParams[String(d[1])] | 0.0;
}

// Returns the result of one parsed line
function processLine(d) {

    logid("processLine")(d);

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


%}

@lexer lexer

# This is one line of GCODE. It consists of the following parts:
# * An optional block delete character (/) which acts as a deactivate switch
# * An optional line number (Ie. N200)
# * One or more line items (Optionally space separated)
# * End of line (newline)
line ->
    block_delete:? linenumber:? line_items EOL {% processLine %}

block_delete ->
    "/" {% id %}

linenumber ->
    _ %linenumber_command int_or_float _ {% function (d) { return {command: d[1].value, value: d[2]}; } %}

line_items ->
    line_item {% id %}
    | line_items _ line_item {% append %}

line_item ->
    comment {% id %}
    | parameter_setting {% id %}
    | word {% id %}

word ->
    %command _ number {% function (d) { return {command: d[0].value, value: d[2]}; } %}

parameter_start ->
    %paramstart {% id %}

parameter_setting ->
    parameter_start parameter_index _ %equals _ number {% function (d) { return {command: d[0].value + d[1], value: d[5], pos: lexer}; }  %}

comment ->
    %comment {% function (d) { return {command: 'COMMENT', value: d[0].value}; } %}

gcode_expression ->
    "[" _ expression _ "]" {% (d) => d[2] %}

expression ->
    logical_expression {% id %}

logical_expression ->
    comparative_expression {% id %}
    | logical_expression _ "AND" _ comparative_expression {% (d) => d[0] && d[4] %}
    | logical_expression _ "OR" _ comparative_expression {% (d) => d[0] || d[4] %}
    | logical_expression _ "XOR" _ comparative_expression {% (d) => ((d[0] && !d[4]) || (!d[0] && d[4])) %}

comparative_expression ->
    additive_expression {% id %}
    | comparative_expression _ "EQ" _ additive_expression {% (d) => d[0] == d[4] %}
    | comparative_expression _ "NE" _ additive_expression {% (d) => d[0] != d[4] %}
    | comparative_expression _ "GT" _ additive_expression {% (d) => d[0] > d[4] %}
    | comparative_expression _ "GE" _ additive_expression {% (d) => d[0] >= d[4] %}
    | comparative_expression _ "LT" _ additive_expression {% (d) => d[0] < d[4] %}
    | comparative_expression _ "LE" _ additive_expression {% (d) => d[0] <= d[4] %}

additive_expression ->
    multiplicative_expression {% id %}
    | additive_expression _ "+"  _ multiplicative_expression {% (d) => d[0] + d[4] %}
    | additive_expression _ "-"  _ multiplicative_expression {% (d) => d[0] - d[4] %}

multiplicative_expression ->
    power_expression {% id %}
    | multiplicative_expression _ "*"  _ power_expression {% (d) => d[0] * d[4] %}
    | multiplicative_expression _ "/"  _ power_expression {% (d) => d[0] / d[4] %}
    | multiplicative_expression _ "MOD"  _ power_expression {% (d) => d[0] % d[4] %}

power_expression ->
    function_expression {% id %}
    | power_expression _ "**"  _ function_expression {% (d) => Math.pow(d[0], d[4]) %}

function_expression ->
    number {% id %}
    | "ATAN" _ gcode_expression _ "/" _ gcode_expression {% (d) => Math.degrees(Math.atan(d[2], d[6])) %}
    | "ABS" _ gcode_expression {% (d) => Math.abs(d[2]) %}
    | "ACOS" _ gcode_expression {% (d) => Math.degrees(Math.acos(d[2])) %}
    | "ASIN" _ gcode_expression {% (d) => Math.degrees(Math.asin(d[2])) %}
    | "COS" _ gcode_expression {% (d) => Math.cos(Math.radians(d[2])) %}
    | "EXP" _ gcode_expression {% (d) => Math.exp(d[2]) %}
    | "FIX" _ gcode_expression {% (d) => Math.floor(d[2]) %}
    | "FUP" _ gcode_expression {% (d) => Math.ceil(d[2]) %}
    | "ROUND" _ gcode_expression {% (d) => Math.round(d[2]) %}
    | "LN" _ gcode_expression {% (d) => Math.log(d[2]) %}
    | "SIN" _ gcode_expression {% (d) => Math.sin(Math.radians(d[2])) %}
    | "SQRT" _ gcode_expression {% (d) => Math.sqrt(d[2]) %}
    | "TAN" _ gcode_expression {% (d) => Math.tan(d[2]) %}
    | "EXISTS" _ gcode_expression {% (d) => Math.cos(d[2]) %}

number ->
    primary {% id %}
    | _ "-" number {% (d) => d[2] * -1 %}
    | _ "+" number {% (d) => d[2] * 1 %}

primary ->
    int_or_float {% id %}
    | gcode_expression {% id %}
    | parameter_expression {% id %}

parameter_expression ->
    parameter_start parameter_index {% getparam %}

parameter_index ->
    int {% id %}
    | gcode_expression {% id %}
    | parameter_expression {% id %}

int_or_float ->
    int {% id %}
    | float {% id %}

int ->
    %int {% (d) => parseInt(d[0]) %}

float ->
    %float {% (d) => parseFloat(d[0]) %}

EOL ->
    %EOL {% empty %}
