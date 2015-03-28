'use strict';

let config = require('../test/config');
let r = require('../lib/rethinkdb')(config.rethinkdb);

exports.up = function(next){
  r.dbCreate(config.rethinkdb.db)
    .run(next);
};

exports.down = function(next){
  r.dbDrop(config.rethinkdb.db)
    .run(next);
};
