'use strict';

let _ = require('lodash');
let r = require('./rethinkdb')();

class Document {

  static *find(criteria){
    if (!criteria) criteria = {};
    let result = yield r.table(this._TABLE)
      .filter(criteria)
      .run();
    for (let i in result) {
      result[i] = new this(result[i], true);
    }
    return result;
  }

  static *findOne(criteria){
    if (!criteria) criteria = {};
    let result = yield r.table(this._TABLE)
      .filter(criteria)
      .limit(1)
      .run();
    if(result.length) {
      return new this(result[0], true);
    }
    return null;
  }

  static *findById(id){
    let result = yield r.table(this._TABLE)
      .get(id)
      .run();
    if (result.length == 1) {
      return new this(result[0], true);
    }
    return null;
  }

  static *create(properties){
    return yield new this(properties).save();
  }

  constructor(properties, isOld) {
    this.set(properties);
    if (!isOld) {
      this._isNew = true;
    } else {
      this.id = properties.id;
    }
  }

  set(properties){
    let data = _.pick(properties, this.constructor._PATHS);
    _.assign(this, data);
  }

  *save(){
    let data = _.pick(this, this.constructor._PATHS);
    if (this._isNew) {
      let result = yield r.table(this.constructor._TABLE)
        .insert(data)
        .run();
      this.id = result.generated_keys[0];
      delete this._isNew;
    } else {
      yield r.table(this.constructor._TABLE)
        .get(this.id)
        .update(data)
        .run();
    }
    return this;
  }

  *delete(){
    yield r.table(this.constructor._TABLE)
      .get(this.id)
      .delete()
      .run();
    delete this.id; // This will also make any calls to save() throw an error
  }

  equals(doc){
    return this.id == doc.id;
  }

}

module.exports = Document;
