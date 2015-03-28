'use strict';

let config = require('../test/config');
let r = require('../lib/rethinkdb')();
let TABLE = 'users';

exports.up = function(next){
  r.tableCreate(TABLE)
    .run(next);
};

exports.down = function(next){
  r.tableDrop(TABLE)
    .run(next);
};
