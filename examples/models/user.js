'use strict';

let r = require('../../')();
let Document = r.Document;
let bcrypt = require('co-bcryptjs');

class User extends Document {

  static *findByUsername(username){
    let result = yield r.table(this._TABLE)
      .filter({ username })
      .limit(1)
      .run();
    if (result.length == 1) {
      return new User(result[0], true);
    }
    return null;
  }

  *save(){
    yield this.hashPassword();
    return yield super.save();
  }

  *hashPassword(){
    if (this._newPassword) {
      let salt = yield bcrypt.genSalt(10);
      this._password = yield bcrypt.hash(this.password, salt);
      this._newPassword = false;
    }
  }

  get password(){
    return this._password;
  }
  set password(password){
    this._password = password;
    this._newPassword = true;
  }

  *isPassword(password){
    return yield bcrypt.compare(password, this.password);
  }
}

User._TABLE = 'users';
User._PATHS = ['username', 'password'];

module.exports = User;
