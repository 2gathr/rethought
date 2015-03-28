# rethought
This is a JavaScript object-wrapper for RethinkDB documents. It provides a Document class making use of generators.

I heavily borrowed from http://knowthen.com/episode-5-creating-models-in-koajs/.

See `examples/models.user.js` and `test/user.js` for an example of how powerful this tool already is.

## Installation
Make sure you've got [io.js](https://iojs.org/) installed. Then install with `npm install rethought`.

## ES6
This package uses generators and classes, which are only available in [io.js](https://iojs.org/).

## Testing
Run the tests with `npm test`.
