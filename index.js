'use strict';

/**
 * module dependencies
 */

const co = require('co');

/**
 * utils
 */

const isGeneratorFunction = f =>
  typeof f === 'function' &&
  f.constructor.name === 'GeneratorFunction';

const hasCatch = p =>
  typeof p === 'object' &&
  p.catch &&
  typeof p.catch === 'function';

const slice = [].slice;


/**
 * factory
 */

const modernFactory = function modernFactory(makeRet) {
  return function modern(fn) {
    // generator function
    if (isGeneratorFunction(fn)) fn = co.wrap(fn);

    return makeRet(function(next, args) {
      try {
        const ret = fn.apply(this, args); // call
        if (hasCatch(ret)) ret.catch(next); // catch
      } catch (e) {
        next(e);
      }
    });
  }
};

/**
 * case1 `req, res, next`
 */

exports = module.exports = modernFactory(function(executor) {
  return function(req, res, next) {
    executor.call(this, next, slice.call(arguments));
  };
});

/**
 * case2 `err, req, res, next`
 */

exports.err = modernFactory(function(executor) {
  return function(err, req, res, next) {
    executor.call(this, next, slice.call(arguments));
  };
});