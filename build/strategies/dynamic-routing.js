"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _abstract = _interopRequireDefault(require("./abstract"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DynamicRoutingStrategy extends _abstract.default {
  bindHooksTo() {
    var adapters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      coordinator
    } = adapters;
    var updateStoreHook = this.updateStore.bind(this);

    if (coordinator == null) {
      throw new Error('Coordinator adapter is required');
    }

    coordinator.hooks.after('getServers', updateStoreHook);
  }

  applyTo() {
    var providers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      http
    } = providers;

    if (http == null) {
      throw new Error('HTTP provider is required');
    }

    http.interceptors.request.use(config => {
      var {
        host
      } = this.store.servers[0];
      config.baseURL = host;
      return config;
    }, e => Promise.reject(e));
  }

  updateStore(data) {
    var {
      servers = []
    } = data;
    this.store.servers = [...servers];
    return data;
  }

}

exports.default = DynamicRoutingStrategy;