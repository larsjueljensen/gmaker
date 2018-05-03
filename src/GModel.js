/*
A real value may be:

An explicit number, 4

An expression, [2+2]

A parameter value, #88

A unary function value, acos[0]
*/


class GValue {
    constructor(code, value) {
        this.code = code;
        this.value = value;
    }
}

class GWord {
    constructor(code, optional) {
        this.name = name;
        this.optional = optional;
        this.value = undefined;
    }
}

class GParser {

    static parseWords(command) {
        return command.match(GParser.REGEX_WORD);
    }

    static parseNumberValue(command, regex) {
        let parseResult = command.match(regex);
        return (parseResult) ? Number(parseResult[1]) : null;
    }


}

GParser.REGEX_WORD = /[GgMmXxYyZzIiJjKkRrPpFf](\-?[\d\.]+|\[.*?\])/g;

GParser.G_COMMANDS = [
    {'G0', ['X', 'Y', 'Z']},
    {'G1', ['X', 'Y', 'Z', 'F']}, // Move
    {'G2', ['X', 'Y', 'Z', 'I', 'J', 'K', 'R', 'P', 'F']},
    {'G3', ['X', 'Y', 'Z', 'I', 'J', 'K', 'R', 'P', 'F']}, // Arc move
    'G4', // Dwell
    'G5', 'G5.1', 'G5.2', // Splines
    'G7', 'G8', // Diameter / radius mode (for lathes)
    'G10 L1', 'G10 L10', 'G10 L11', // Tool table
    'G10 L2', 'G10 L20', // Coordinate System Origin
    'G20', 'G21', // Units (inches or mm)
    'G28', 'G28.1', 'G30', 'G30.1', // Goto predefined position
    'G33', // Spindle synchronized motion
    'G38.2', 'G38.3', 'G38.4', 'G38.5', // Probing
    'G40', 'G41', 'G41.1', 'G42', 'G42.2', // Cutter compensation
    'G43', 'G43.1', 'G43.2', 'G49', // Tool length offset
    'G53', // Move in machine coordinates
    'G54', 'G55', 'G56', 'G57', 'G58', 'G59', 'G59.1', 'G59.2', 'G59.3', // Select coordinate system
    'G61', 'G61.1', 'G64', // Path control mode
    'G73', // Drilling cycle with chip breaking
    'G76', // Multi-pass threading
    'G80', // Cancel motion modes
    'G81', 'G82', 'G83', // Drilling cycle
    'G85', 'G86', 'G89', // Boring cycle
    'G90', 'G90.1', 'G91', 'G91.1', // Distance mode
    'G92', 'G92.1', 'G92.2', 'G92.3', // Coordinate system offset
    'G93', 'G94', 'G95', // Feed modes
    'G96', // Spindle control mode
    'G98', 'G99' // Canned cycle Z retract mode
];

GParser.WORDS = [
    'X', 'Y', 'Z',
    'I', 'J', 'K',
    'U', 'V', 'W',
    'P', 'F', 'R'
];

class GCoordinateSystem {
    constructor() {
        this.X = 1; // Increase from left to right by 1
        this.Y = 1; // Increase from top to bottom by 1
        this.Z = 1; // Increase from far to near by 1
    }
}

class GSurface {

}

class GAxes {
    constructor(X, Y, Z) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }
}

class GOffsets {
    constructor(I, J, K) {
        this.I = I; // X offset
        this.J = J; // Y offset
        this.K = K; // Z offset
    }
}

class GPos {
    constructor(X, Y, Z) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }
}

class GState {
    constructor () {
        this.units = 'mm';
        this.pos = new GPos(0, 0, 0);
    }

}

class GDocumentProperties {
    constructor () {
    }
}

class GDocument {
    constructor() {
        this.properties = new GDocumentProperties();
    }

    get properties () {
        return this.properties;
    }

}

class GCode {
    constructor(doc, command) {
        this.doc = doc;
        this.command = command;
    }

    get document () {
        return this.doc;
    }

}

class GMove extends GCode {
    constructor(doc, command) {
        super(doc, command);
        this.axes = GParser.parseAxes(command);
    }
}

class GArcMove extends GCode {
    constructor(doc, command) {
        super(doc, command);
        this.axes = GParser.parseAxes(command);
    }
}

/*
    Name: Rapid move
    Description:
        For rapid motion, program G0 axes, where all the axis words are optional.
        The G0 is optional if the current motion mode is G0. This will produce
        coordinated motion to the destination point at the maximum rapid rate (or slower).
        G0 is typically used as a positioning move.
*/
class G0 extends GMove {
    constructor(command) {
        super(null, command);
    }
}

/*
    Name: Linear move
    Description:
        For linear (straight line) motion at programed feed rate (for cutting or not),
        program G1 'axes', where all the axis words are optional. The G1 is optional
        if the current motion mode is G1. This will produce coordinated motion to
        the destination point at the current feed rate (or slower).
*/
class G1 extends GMove {
    constructor(command) {
        super(null, command);
        this.feedRate = GParser.parseFeedRate(command);
    }
}
