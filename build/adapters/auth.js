"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = _interopRequireDefault(require("./auth.data"));

var _abstract = _interopRequireDefault(require("./abstract"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var extractData = (_ref) => {
  var {
    data
  } = _ref;
  return data;
};

class AuthAdapter extends _abstract.default {
  constructor() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      path = _auth.default.path,
      endpoints = _auth.default.endpoints,
      channels = {}
    } = settings;
    var {
      http
    } = channels;

    if (http == null) {
      throw new Error('HTTP channel is required');
    }

    super();
    this.path = path;
    this.endpoints = endpoints;
    this.http = http;
  }

  initHooks() {
    this.hooks.wrap(this, ['signUp', 'signIn', 'signOut', 'refreshToken']);
    super.initHooks();
  }

  signUp(_ref2) {
    var _this = this;

    return _asyncToGenerator(function* () {
      var {
        username,
        password
      } = _ref2;
      var {
        data
      } = yield _this.http.post("".concat(_this.path).concat(_this.endpoints.signUp), {
        username,
        password
      });
      return data;
    })();
  }

  signIn(_ref3) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      var {
        username,
        password
      } = _ref3;
      var {
        data
      } = yield _this2.http.post("".concat(_this2.path).concat(_this2.endpoints.signIn), {
        username,
        password
      });
      return data;
    })();
  }

  signOut() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      var {
        data
      } = yield _this3.http.post("".concat(_this3.path).concat(_this3.endpoints.signOut), {});
      return data;
    })();
  }

  refreshToken(_ref4) {
    var {
      refreshToken
    } = _ref4;
    return this.http.post("".concat(this.path).concat(this.endpoints.refreshToken), {
      refreshToken
    }).then(extractData);
  } // async resetPassword() {
  //   const { data } = await this.http.post(
  //     `${this.path}${this.endpoints.resetPassword}`,
  //     {}
  //   )
  //   return data
  // }


}

exports.default = AuthAdapter;