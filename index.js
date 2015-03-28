'use strict';

let dash = require('./lib/rethinkdb');

let r;

module.exports = function(options){
  if (!r) {
    r = dash(options);
    r.Document = require('./lib/document');
  }
  return r;
};
