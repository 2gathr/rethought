'use strict';

let models = {};

module.exports = function(modelName, model){
  if (!model){
    return models[modelName];
  } else {
    if (modelName in models) throw new Error(`Model '${modelName}' was already registered`);
    models[modelName] = model;
  }
};
