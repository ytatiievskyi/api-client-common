"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _abstract = _interopRequireDefault(require("./abstract"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class JWTAuthStrategy extends _abstract.default {
  constructor(settings) {
    super(settings);
  }

  init() {
    super.init();
  }

  bindHooksTo() {
    var adapters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      auth
    } = adapters;

    if (auth == null) {
      throw new Error('Auth adapter is required');
    }

    var updateStoreHook = this.updateStore.bind(this);
    var clearStoreHook = this.clearStore.bind(this);
    auth.hooks.after('signUp', updateStoreHook).after('signIn', updateStoreHook).after('refreshToken', updateStoreHook).after('signOut', clearStoreHook);
    this.refreshTokenFunc = auth.refreshToken.bind(auth);
  }

  applyTo() {
    var _this = this;

    var channels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      http
    } = channels;

    if (http == null) {
      throw new Error('HTTP channel is required');
    }

    this.refreshRequest = null;
    http.interceptors.request.use(config => {
      if (!this.store.accessToken) {
        return config;
      }

      var newConfig = _objectSpread({
        headers: {}
      }, config);

      newConfig.headers.Authorization = "Bearer ".concat(this.store.accessToken);
      return newConfig;
    }, e => Promise.reject(e));
    http.interceptors.response.use(r => r, /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (error) {
        if (!_this.store.refreshToken || error.response.status !== 401 || error.config.retry) {
          throw error;
        }

        if (!_this.refreshRequest) {
          _this.refreshRequest = _this.refreshTokenFunc({
            refreshToken: _this.store.refreshToken
          });
        }

        yield _this.refreshRequest;

        var newRequest = _objectSpread({}, error.config, {
          retry: true
        });

        return http(newRequest);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  updateStore(data) {
    this.store.accessToken = data.accessToken;
    this.store.refreshToken = data.refreshToken;
  }

  clearStore(data) {
    this.store.accessToken = null;
    this.store.refreshToken = null;
  }

}

exports.default = JWTAuthStrategy;