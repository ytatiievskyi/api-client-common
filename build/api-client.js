"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _providers = _interopRequireDefault(require("./providers"));

var _adapters = _interopRequireDefault(require("./adapters"));

var _strategies = _interopRequireDefault(require("./strategies"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const {
      http
    } = _providers.default;

    if (providers.http == null) {
      providers.http = http;
    }

    const {
      AuthAdapter
    } = _adapters.default;

    if (adapters.auth == null) {
      adapters.auth = new AuthAdapter({
        providers
      });
    }

    const {
      JWTAuthStrategy
    } = _strategies.default;

    if (strategies.auth == null || !Array.isArray(strategies.auth)) {
      strategies.auth = [];
    }

    if (strategies.auth.length < 1) {
      const jwt = new JWTAuthStrategy({
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