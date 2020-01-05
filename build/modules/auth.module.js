"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _api = _interopRequireDefault(require("./api.module"));

var _providers = require("../providers");

var _adapters = require("../adapters");

var _strategies = require("../strategies");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JWTAuthModule extends _api.default {
  get api() {
    return this.adapters.auth;
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

}

exports.default = JWTAuthModule;