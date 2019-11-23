"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class AbstractStrategy {
  /* istanbul ignore next */
  constructor() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      store = {}
    } = settings;
    this.store = store;
    this.init();
  }
  /* istanbul ignore next */


  init() {}
  /* istanbul ignore next */


  bindHooksTo() {
    var adapters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    throw new Error('Abstract method');
  }
  /* istanbul ignore next */


  applyTo() {
    var providers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    throw new Error('Abstract method');
  }

}

exports.default = AbstractStrategy;