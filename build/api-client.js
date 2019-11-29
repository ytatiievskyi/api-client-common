"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _providers = require("./providers");

var _adapters = require("./adapters");

var _strategies = require("./strategies");

class ApiClient {
  constructor() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      store = {},
      providers = {},
      adapters = {},
      strategies = {},
      options = {},
      dependencies = {}
    } = settings;
    this.store = store;
    this.providers = providers;
    this.adapters = adapters;
    this.strategies = strategies;
    this.options = options;
    this.dependencies = dependencies;
    this.init();
  }

  init() {
    var {
      options: {
        isCreateDefaults = true
      }
    } = this;

    if (isCreateDefaults) {
      this.createDefaults();
    }

    this.applyStrategies();
  }

  createDefaults() {
    var {
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

    if (strategies.auth == null) {
      strategies.auth = new _strategies.JWTAuthStrategy({
        store: store.auth
      });
    }
  }

  applyStrategies() {
    var {
      providers,
      adapters,
      strategies
    } = this;
    var strategyList = Object.keys(strategies).map(key => strategies[key]);
    strategyList.forEach(strategy => strategy.bindHooksTo(adapters));
    strategyList.forEach(strategy => strategy.applyTo(providers));
  }

  healthCheck() {
    return this.providers.http('/test').then((_ref) => {
      var {
        data
      } = _ref;
      return data;
    });
  }

}

exports.default = ApiClient;