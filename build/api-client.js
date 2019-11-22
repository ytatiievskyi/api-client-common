"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _providers = require("./providers");

var _adapters = require("./adapters");

var _strategies = require("./strategies");

class ApiClient {
  constructor(settings = {}) {
    const {
      store = {},
      providers = {},
      adapters = {},
      strategies = {}
    } = settings;
    this.store = store;
    this.providers = providers;
    this.adapters = adapters;
    this.strategies = strategies;
    this.init();
  }

  init() {
    const {
      store,
      providers,
      adapters,
      strategies
    } = this;

    if (providers.http == null) {
      providers.http = _providers.http;
    }

    if (adapters.auth == null) {
      adapters.auth = new _adapters.AuthAdapter({
        providers
      });
    }

    if (strategies.auth == null || !Array.isArray(strategies.auth)) {
      strategies.auth = [];
    }

    if (strategies.auth.length < 1) {
      const jwt = new _strategies.JWTAuthStrategy({
        store,
        adapters
      });
      strategies.auth.push(jwt);
    }

    strategies.auth.forEach(strategy => strategy.bindHooksTo(adapters));
    strategies.auth.forEach(strategy => strategy.applyTo(providers));
  }

  healthCheck() {
    return this.providers.http('/test').then(({
      data
    }) => data);
  }

}

exports.default = ApiClient;