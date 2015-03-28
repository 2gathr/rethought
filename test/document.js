'use strict';

let assert = require('assert');
require('co-mocha');

let config = require('../test/config');
let r = require('../')(config.rethinkdb);
let Document = r.Document;

class Some  extends Document {}

Some._TABLE = 'somes';
Some._PATHS = ['foo'];

describe('Abstract Document', function(){
  beforeEach(`delete '${Some._TABLE}' table`, function *(){
    yield r.table(Some._TABLE)
      .delete()
      .run();
  });

  describe('Document.constructor()', function(){
    it('should be instanciateable', function(){
      let some = new Some();
      assert(some instanceof Some);
    });
    it('should allow not passing any properties', function(){
      assert.ok(new Some());
    });
  });
  describe('Document.create()', function(){
    it('should save to DB directly', function *(){
      yield Some.create({ foo: 'bar' });
      let some = yield Some.findOne({});
      assert.equal(some.foo, 'bar');
    });
    it('should allow not passing any properties', function *(){
      assert.ok(yield Some.create());
    });
    it('should return the saved user', function *(){
      let some = yield Some.create({ foo: 'bar' });
      assert(some instanceof Some);
    });
    it('should set an id', function *(){
      let some = yield Some.create({ foo: 'bar' });
      assert(some.id);
    });
  });
  describe('Document.findOne()', function(){
    it('should return one instance', function *(){
      yield Some.create({ foo: 'bar' });
      yield Some.create({ foo: 'baz' });
      let some = yield Some.findOne({});
      assert(some instanceof Some);
    });
    it('should return `null` if there is no matching document', function *(){
      yield Some.create({ foo: 'bar' });
      yield Some.create({ foo: 'baz' });
      let some = yield Some.findOne({ foo: 'foobar' });
      assert.strictEqual(some, null);
    });
    it('should allow not passing any properties', function *(){
      yield Some.findOne();
    });
  });
  describe('Document#delete()', function(){
    it('should delete a document from DB', function *(){
      let some = yield Some.create({ foo: 'baz' });
      yield some.delete();
      let results = yield Some.find();
      assert.strictEqual(results.length, 0);
    });
    it('should not let you save the doc after deletion', function *(){
      let some = yield Some.create({ foo: 'baz' });
      yield some.delete();
      let errored = false;
      try {
        let other = yield some.save();
      } catch (err) {
        errored = true;
      }
      assert(errored);
    });
  });
});
