'use strict';

let dash = require('rethinkdbdash');
let _ = require('lodash');

let r;

module.exports = function(options){
  if (!r) {
    r = dash(options);
  }
  return r;
};
