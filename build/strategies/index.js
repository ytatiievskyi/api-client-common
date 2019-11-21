"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _abstract = _interopRequireDefault(require("./abstract"));

var _jwt = _interopRequireDefault(require("./jwt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  AbstractStrategy: _abstract.default,
  JWTAuthStrategy: _jwt.default
};
exports.default = _default;