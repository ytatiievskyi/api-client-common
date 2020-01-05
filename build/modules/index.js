"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ApiModule", {
  enumerable: true,
  get: function get() {
    return _api.default;
  }
});
Object.defineProperty(exports, "JWTAuthModule", {
  enumerable: true,
  get: function get() {
    return _auth.default;
  }
});

var _api = _interopRequireDefault(require("./api.module"));

var _auth = _interopRequireDefault(require("./auth.module"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }