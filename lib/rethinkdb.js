'use strict';

let dash = require('rethinkdbdash');

let r;

module.exports = function(options){
  if (!r) {
    r = dash(options);
  }
  return r;
};
