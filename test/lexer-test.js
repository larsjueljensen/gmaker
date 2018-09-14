(function (global) {
    let should = require('should');
    global.moo = require('moo');
    let grammar = require('../src/gcode.js');
    let lexer = grammar.Lexer;

    describe('lexer', function() {

        function testToken(tokenType, tokenValue) {
            lexer.reset(tokenValue);
            let token = lexer.next();
            token.type.should.equal(tokenType);
            token.value.should.equal(tokenValue);
        }

        it('should recognize expstart', function() {
            testToken('expstart', '[');
        });
        it('should recognize expend', function () {
            testToken('expend', ']');
        });
        it('should recognize paramstart', function () {
            testToken('paramstart', '#');
        });
        it('should recognize all operators', function () {
            let operators = [
                '**', '+', '-', '*', '/',
                'OR', 'XOR', 'AND', 'MOD',
                'EQ', 'NE', 'GT', 'GE', 'LT', 'LE'
            ];
            operators.forEach(function (operator) {
                testToken('operator', operator);
            });
        });
        it('should recognize all functions', function () {
            let functions = [
                'ATAN','ABS','ACOS','ASIN',
                'COS','EXP','FIX','FUP',
                'ROUND','LN','SIN','SQRT',
                'TAN','EXISTS'
            ];
            functions.forEach(function (f) {
                testToken('function', f);
            });
        });
        it('should recognize linenumber command', function () {
            testToken('linenumber_command', 'N');
        });
        it('should recognize all command words', function () {
            let commands = [
                'A', 'B', 'C', 'D', 'F', 'G', 'H',
                'I', 'J', 'K', 'L', 'M', 'P', 'Q',
                'R', 'S', 'T', 'U', 'V', 'W', 'X',
                'Y', 'Z'
            ];
            commands.forEach(function (command) {
                testToken('command', command);
            });
        });
        it('should recognize floating point numbers', function () {
            testToken('float', '25.43');
            testToken('float', '5.95');
            testToken('float', '2.0');
        });
        it('should recognize integers', function () {
            testToken('int', '43');
            testToken('int', '5');
            testToken('int', '2');
        });
        it('should recognize any combination of whitespace', function () {
            testToken('ws', ' ');
            testToken('ws', '\t');
            testToken('ws', '  \t');
            testToken('ws', '\t  \t');
            testToken('ws', ' \t' );
            testToken('ws', '\t \t');
        });
        it('should recognize EOL (end of line)', function () {
            testToken('EOL', '\n');
            testToken('EOL', '\r\n');
        });
    });
}(global));
