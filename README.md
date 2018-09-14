# GMaker


_GMaker is a [G-code](https://en.wikipedia.org/wiki/G-code) editor for [my drawing robot](https://a360.co/2p58N6P)._

The drawing robot works under the following restrictions:
 * Size is A4 paper (297mm x 210mm)
 * Origin is at upper left corner
 * X axis goes from 0 to 297mm`
  * It is actually a bit more, but it is designed to be compatible with A4 paper
 * Y axis goes from 0 to -210mm
  * This is due to the design of the machine which is based on the [CoreXY](https://corexy.com/theory.html) principle.

## Dependencies
It contains a [G-code](https://en.wikipedia.org/wiki/G-code) parser generated with [nearley.js](https://nearley.js.org/) in combination with the [Moo](https://github.com/no-context/moo) lexer. The visualization is done using [Paper.js](http://paperjs.org/).

## Backlog
 * Syntax highlighting.
 * WYSIWYG editing.
 * Link between visual item and editor linenumber.
 * Validation of G-code to ensure proper operation of the drawing robot.
