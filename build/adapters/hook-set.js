"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHandlerSet = createHandlerSet;
exports.createHookSet = createHookSet;
exports.default = void 0;

// TODO: rewrite to classes
// TODO: separate into a standalone library
function createHandlerSet(hookSet) {
  var handlers = []; // const loggers = []

  return {
    add(handler) {
      if (typeof handler === 'function') handlers.push(handler);else throw new TypeError('function is required');
      return hookSet;
    },

    run(data) {
      // TODO: call logger
      // loggers.forEach(logger => {
      //   logger(instance, hookname, method, data)
      // })
      return handlers.reduce((params, handler) => {
        return handler(params);
      }, data);
    } // TODO: assign handler for logging calls and values
    // log(logger) { 
    //   if (typeof logger === 'function')
    //     loggers.push(logger)
    //   else
    //     throw new TypeError('function is required')
    //   return hookSet
    // }


  };
}

function initStock(hookSet, stock) {
  return methods => methods.forEach(method => stock[method] = createHandlerSet(hookSet));
}

function wrapMethod(instance, method, hookSet, names) {
  var prop = instance[method];
  if (prop == null) throw new TypeError("object ".concat(instance, " should has a property ").concat(method));
  if (typeof prop !== 'function') throw new TypeError("property ".concat(method, " should be a function"));
  instance[method] = wrapped.bind(instance); // TODO: need to consider several args not just the first

  function wrapped(param) {
    var onBefore = data => {
      hookSet.before(method).run(data);
      return hookSet.input(method).run(data);
    };

    var onAfter = data => {
      var output = hookSet.output(method).run(data);
      hookSet.after(method).run(output);
      return output;
    };

    var onError = err => {
      hookSet.error(method).run(err);
      throw err;
    };

    try {
      var input = onBefore(param);
      var result = prop.call(instance, input);
      return result instanceof Promise ? result.then(onAfter).catch(onError) : onAfter(result);
    } catch (error) {
      onError(error);
    }
  }
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
  var names = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['input', 'before', 'after', 'output', 'error'];
  var stock = {};
  names.forEach(name => stock[name] = {});
  var hookSet = {};

  hookSet.init = methods => {
    names.forEach(name => initStock(hookSet, stock[name])(methods));
    return hookSet;
  };

  hookSet.wrap = (instance, methods) => {
    if (!(instance instanceof Object)) {
      throw new TypeError("instance ".concat(instance, " should be an Object"));
    }

    names.forEach(name => initStock(hookSet, stock[name])(methods));
    methods.forEach(method => wrapMethod(instance, method, hookSet, names));
    return hookSet;
  };

  names.forEach(name => hookSet[name] = hooksByStock(stock[name]));
  return hookSet;
}

var _default = createHookSet;
exports.default = _default;