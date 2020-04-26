"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _api = _interopRequireDefault(require("./api.module"));

var _channels = require("../channels");

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
      channels,
      adapters,
      strategies
    } = this;

    if (channels.http == null) {
      channels.http = _channels.http;
    }

    if (adapters.auth == null) {
      adapters.auth = new _adapters.AuthAdapter({
        channels
      });
    }

    if (strategies.auth == null) {
      strategies.auth = new _strategies.JWTAuthStrategy({
        store
      });
    }
  }

}

exports.default = JWTAuthModule;