"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _abstract = _interopRequireDefault(require("./abstract"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DynamicRoutingStrategy extends _abstract.default {
  bindHooksTo() {
    var adapters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      balancer
    } = adapters;
    var updateStoreHook = this.updateStore.bind(this);

    if (balancer == null) {
      throw new Error('Balancer adapter is required');
    }

    balancer.afterGetServers = updateStoreHook;
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
      servers = {}
    } = data;
    var {
      servers: previous
    } = this.store;
    this.store.servers = _objectSpread({}, previous, {}, servers);
    return data;
  }

}

exports.default = DynamicRoutingStrategy;