const motions = [
    'G0', 'G1', 'G2', 'G3', 'G4', 'G5.1', 'G5.2',
    'G38.2', 'G38.3', 'G38.4', 'G38.5',
    'G33', 'G33.1', 'G80'
];
const axes = ['X', 'Y', 'Z', 'A', 'B', 'C', 'U', 'V', 'W'];
const offsets = ['I','J','K'];
const numTurns = ['P'];
const feedRate = ['F'];
const radius = ['R'];
const spindleSpeed = ['S'];
const spindleControl = ['M3', 'M4', 'M5'];

const MAX_VELOCITY = 20000;


function upper(string) {
    if (typeof(string) === "string") {
        return string.toUpperCase();
    }
    return string;
}

function lower(string) {
    if (typeof(string) === "string") {
        return string.toLowerCase();
    }
    return string;
}

function clone(object) {
    return JSON.parse(JSON.stringify(object));
}

function parseWords(line) {
    if (line.trim() !== '%') {
        let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(line.toUpperCase() + '\n');
        let parseresults = parser.results;
        if (parseresults.length > 0 && parseresults[0].length > 0) {
            let result = parseresults[0][0];
            if (Array.isArray(result)) {
                return result;
            }
            return [result];
        }
    }
    return [];
}

function isAny(commands, word) {
    return commands.includes(upper(word.command));
}

function isMotion(word) { return motions.includes(upper(word.command) + word.value); }
function isAxis(word) { return isAny(axes, word); }
function isOffset(word) { return isAny(offsets, word); }
function isNumTurns(word) { return isAny(numTurns, word); }
function isFeedRate(word) { return isAny(feedRate, word); }
function isRadius(word) { return isAny(radius, word); }
function isSpindleSpeed(word) { return isAny(spindleSpeed, word) }
function isSpindleControl(word) { return spindleControl.includes(upper(word.command) + word.value); }

function setProp(object, word) {
    object[lower(word.command)] = word.value;
}

function setMotion(state, word) {
    if (isMotion(word)) {
        state.motion = word.value;
    }
}

function setNextPosition(state, word) {

    if (isAxis(word)) {
        setProp(state.position.next, word);
    }

    if (isOffset(word)) {
        setProp(state.position.offset, word);
    }

    if (isNumTurns(word)) {
        state.position.numTurns = word.value;
    }

    if (isRadius(word)) {
        state.position.radius = word.value;
    }
}

function setSpindle(state, word) {
    if (isSpindleSpeed(word)) {
        if (word.value < 0) {throw "Spindle speed can not be negative"}
        state.spindle.speed = word.value;
    }

    if (isSpindleControl(word)) {
        state.spindle.mode = word.value;
    }
}

function setFeedRate(state, word) {
    if (isFeedRate(word)) {
        state.feedrate = word.value;
    }
}

function setState(state, word) {
    setMotion(state, word);
    setNextPosition(state, word);
    setFeedRate(state, word);
    setSpindle(state, word);
}

function isEmpty(object) {
    return JSON.stringify(object) === '{}';
}

function positionEquals(posA, posB) {
    return posA.x === posB.x && posA.y === posB.y;
}

function calculateNewState(state, words) {
    let newState = clone(state);

    if (! isEmpty(newState.position.next)) {
        newState.position.current = clone(newState.position.next);
    }

    //newState.position.next = clone(newState.position.current);
    newState.position.offset = {};
    newState.position.radius = 0;

    for (let i = 0; i < words.length; i++) {
        setState(newState, words[i]);
    }

    return newState;
}

function convertGCodeToVisual(gcodeAsText) {

    clear();

    let states = [{
        spindle: {
            speed: null,
            mode: null
        },
        motion: null,
        plane: 'XY',
        position: {
            current: { x: 0, y: 0, z: 0 },
            next: {},
            offset: {},
            numTurns: 0,
            radius: 0
        },
        feedRate: null
    }];

    let lines = gcodeAsText.trim().split('\n');

    for (let i = 0; i < lines.length; i++) {
        states.push(calculateNewState(states[states.length - 1], parseWords(lines[i])));
    }
    convertStatesToVisual(states);
}

function convertStatesToVisual(states) {

    let initialState = states.shift();

    while (states.length > 0) {
        convertStateToVisual(states.shift());
    }
}

function convertStateToVisual(state) {

    if (! isEmpty(state.position.next)) {

        if (!positionEquals(state.position.current, state.position.next)) {
            if ([3,4].includes(state.spindle.mode)) { // Linear
                if ([0,1].includes(state.motion)) {
                    if (distance(state.position.current, state.position.next) > 0) {
                        drawLine(state.position.current, state.position.next);
                    }
                }
                if ([2,3].includes(state.motion)) { // Arc
                    let clockwise = (state.motion === 2);
                    if (! isEmpty(state.position.offset)) {
                        drawArcCenterFormat(state.position.current, state.position.next, state.position.offset, clockwise);
                    } else if (state.position.radius !== 0) {
                        drawArcRadiusFormat(state.position.current, state.position.next, state.position.radius, clockwise);
                    }
                }
            }
        }
    }
}

function distance(posA, posB) {
    return Math.sqrt(
        Math.pow(posA.x - posB.x, 2) +
        Math.pow(posA.y - posB.y, 2)
    );
};
