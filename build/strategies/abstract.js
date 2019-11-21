"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class AbstractStrategy {
  constructor(settings = {}) {
    const {
      store = {},
      adapters = {}
    } = settings;
    this.store = store;
    this.adapters = adapters;
  }

  bindHooksTo(adapters = {}) {
    throw new Error('Abstract method');
  }

  applyTo(providers = {}) {
    throw new Error('Abstract method');
  }

}

exports.default = AbstractStrategy;