'use strict';

let assert = require('assert');
require('co-mocha');

let config = require('../test/config');
let r = require('../index')(config.rethinkdb);
let User = require('../examples/models/user.js');

describe('User Model', function(){
  beforeEach('delete `users` table', function *(){
    yield r.table('users')
      .delete()
      .run();
  });

  it('should create a user', function(){
    let user = new User();
    assert.equal(typeof user, 'object');
    assert(user instanceof User);
  });
  it('should store properties passed when instantiated', function(){
    let username = 'bob';
    let user = new User({ username: username });
    assert.equal(user.username, username);
  });
  it('should assign an id when saved', function *(){
    let username = 'alice', password = 'secret';
    let user = new User({ username: username, password: password });
    yield user.save();
    assert(user.id);
  });
  it('shoud find a user by username', function *(){
    let username = 'bob', password = 'secret';
    let user = new User({ username, password });
    yield user.save();
    let foundUser = yield User.findByUsername(username);
    assert.equal(foundUser.id, user.id);
    assert(foundUser instanceof User);
  });
  it('should not save the password as plain text', function *(){
    let username = 'alice', password = 'secret';
    let user = new User({ username, password });
    yield user.save();
    let foundUser = yield User.findByUsername(username);
    assert.notEqual(foundUser.password, password);
  });
  it('should validate a correct password', function *(){
    let username = 'bob', password = '123456';
    let user = new User({ username, password });
    yield user.save();
    assert(yield user.isPassword(password));
  });
  it('should not validate an incorrect password', function *(){
    let username = 'alice', password = '123456';
    let user = new User({ username, password });
    yield user.save();
    yield user.save();
    assert(!(yield user.isPassword('wrong')));
  });
  it('should find multiple users', function *(){
    let username = 'foobar', password = '123456';
    let count = 5, array = [];
    while (count--) {
      let user = new User({ username, password });
      array.push(user.save());
    }
    yield array;
    let users = yield User.find({ username });
    assert.equal(users.length, 5);
    users.forEach(function(user){
      assert(user instanceof User);
    });
  });
  it('should treat another object, refrencing the same document in the db, as equal', function *(){
    let username = 'bob', password = 'secret';
    let user = new User({ username, password });
    yield user.save();
    let foundUser = yield User.findByUsername(username);
    assert(user.equals(foundUser));
  });
  it('should not treat 2 different users as equal', function *(){
    let username = 'bob', password = '123456';
    let bob = new User({ username, password });
    username = 'alice';
    let alice = new User({ username, password });
    yield [bob.save(), alice.save()];
    assert(!bob.equals(alice));
  });
  it('should not allow client-side generation of IDs', function *(){
    let id = 'random', username = 'bob';
    let user = new User({ id, username });
    yield user.save();
    assert.notEqual(user.id, id);
  });
  it('should directly save a user to DB', function *(){
    let username = 'alice', password = 'secret';
    let user = yield User.create({ username, password });
    let foundUser = yield User.findByUsername(username);
    assert.equal(foundUser.id, user.id);
    assert(foundUser instanceof User);
  });
});
