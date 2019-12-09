"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHandlerSet = createHandlerSet;
exports.createHookSet = createHookSet;
exports.default = void 0;

function createHandlerSet(hookSet) {
  var handlers = [];
  return {
    add(handler) {
      if (typeof handler === 'function') handlers.push(handler);else throw new TypeError('function is required');
      return hookSet;
    },

    run(data) {
      return handlers.reduce((params, handler) => {
        return handler(params);
      }, data);
    }

  };
}

function initStock(hookSet, stock) {
  return methods => methods.forEach(method => stock[method] = createHandlerSet(hookSet));
}

function hooksByStock(stock) {
  return function () {
    if (arguments.length < 1) {
      throw new TypeError('method name is required');
    }
    /* istanbul ignore next */


    var method = arguments.length <= 0 ? undefined : arguments[0];
    var handlerSet = stock[method];

    if (handlerSet == null) {
      throw new Error("method ".concat(method, " is not registered"));
    }

    if (arguments.length < 2) {
      return handlerSet;
    }
    /* istanbul ignore next */


    var hook = arguments.length <= 1 ? undefined : arguments[1];
    return handlerSet.add(hook);
  };
}

function createHookSet() {
  var names = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['before', 'after', 'error'];
  var stock = {};
  names.forEach(name => stock[name] = {});
  var hookSet = {};

  hookSet.init = methods => {
    names.forEach(name => initStock(hookSet, stock[name])(methods));
    return hookSet;
  };

  names.forEach(name => hookSet[name] = hooksByStock(stock[name]));
  return hookSet;
}

var _default = createHookSet;
exports.default = _default;