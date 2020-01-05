"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _modules = require("./modules");

class ApiClient {
  constructor() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      modules = {},
      options = {}
    } = settings;
    this.modules = modules;
    this.options = options;
    this.api = {};
    this.init();
  }

  init() {
    var {
      options: {
        isCreateDefaults = true
      },
      modules
    } = this;

    if (isCreateDefaults) {
      this.createDefaults();
    }

    this.api = Object.keys(modules).reduce((obj, key) => {
      obj[key] = modules[key].api;
      return obj;
    }, {});
  }

  createDefaults() {
    var {
      modules
    } = this;

    if (modules.auth == null) {
      modules.auth = new _modules.JWTAuthModule();
    }
  }

  healthCheck() {
    var {
      modules
    } = this;
    var results = Object.keys(modules).map(key => modules[key]).map(m => m.healthCheck());
    return Promise.all(results);
  }

}

exports.default = ApiClient;