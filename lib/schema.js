'use strict';

let Document = require('./document');

let FUNCTION_TYPES = {
  Number: 'number',
  String: 'string',
  Buffer: 'binary',
  Date: 'time',
  Boolean: 'boolean',
  Object: 'object',
  Array: 'array'
};

let TYPES = ['number', 'string', 'binary', 'time', 'boolean', 'object', 'array', 'mixed'];

module.exports = function(schema){

  class ModelDoc extends Document {}

  ModelDoc._PATHS = [];
  ModelDoc._VALIDATORS = {};
  ModelDoc._TYPES = {};

  function analyzeType(type, path) {
    let typeString;
    if (!type) {
      typeString = 'mixed';
    } else if (typeof type == 'string') {
      if (TYPES.indexOf(type) == -1) throw new Error(`unknown type '${type}' for path '${path}'`);
      typeString = type;
    } else if (typeof type == 'function') {
      typeString = FUNCTION_TYPES[type];
      if (!typeString) throw new Error(`unknown type '${type}' for path '${path}'`);
    } else {
      throw new Error(`unknown type '${type}' for path '${path}'`);
    }
    return typeString;
  }

  function setType(path, type){
    if (Array.isArray(type)) {
      type = [ analyzeType(type[0], path) ];
    } else {
      type = analyzeType(type, path);
    }
    ModelDoc._TYPES[path] = type;
  }
  
  for (let path in schema) {
    if (typeof schema[path] == 'object') {
      setType(path, schema[path].type);

    } else {
      setType(path, schema[path]);
    }
  }

  return ModelDoc;
};
