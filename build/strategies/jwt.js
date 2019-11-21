"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _abstract = _interopRequireDefault(require("./abstract"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JWTAuthStrategy extends _abstract.default {
  constructor(settings) {
    super(settings);
    const {
      auth
    } = this.adapters;

    if (auth == null) {
      throw new Error('Auth adapter is required');
    }
  }

  bindHooksTo(adapters = {}) {
    const {
      auth
    } = adapters;

    if (auth == null) {
      throw new Error('Auth adapter is required');
    }

    const updateStoreHook = this.updateStore.bind(this);
    const clearStoreHook = this.clearStore.bind(this);
    auth.afterSignUp = updateStoreHook;
    auth.afterSignIn = updateStoreHook;
    auth.afterRefreshToken = updateStoreHook;
    auth.afterSignOut = clearStoreHook;
  }

  applyTo(providers = {}) {
    const {
      http
    } = providers;

    if (http == null) {
      throw new Error('HTTP provider is required');
    }

    this.refreshRequest = null;
    http.interceptors.request.use(config => {
      if (!this.store.accessToken) {
        return config;
      }

      const newConfig = {
        headers: {},
        ...config
      };
      newConfig.headers.Authorization = `Bearer ${this.store.accessToken}`;
      return newConfig;
    }, e => Promise.reject(e));
    http.interceptors.response.use(r => r, async error => {
      if (!this.store.refreshToken || error.response.status !== 401 || error.config.retry) {
        throw error;
      }

      if (!this.refreshRequest) {
        this.refreshRequest = this.adapters.auth.refreshToken({
          refreshToken: this.store.refreshToken
        });
      }

      await this.refreshRequest;
      const newRequest = { ...error.config,
        retry: true
      };
      return http(newRequest);
    });
  }

  updateStore(data) {
    this.store.accessToken = data.accessToken;
    this.store.refreshToken = data.refreshToken;
    return data;
  }

  clearStore(data) {
    this.store.accessToken = null;
    this.store.refreshToken = null;
    return data;
  }

}

exports.default = JWTAuthStrategy;