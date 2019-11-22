"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "strategies", {
  enumerable: true,
  get: function () {
    return _strategies.default;
  }
});
Object.defineProperty(exports, "adapters", {
  enumerable: true,
  get: function () {
    return _adapters.default;
  }
});
Object.defineProperty(exports, "ApiClient", {
  enumerable: true,
  get: function () {
    return _apiClient.default;
  }
});
exports.default = void 0;

var _strategies = _interopRequireDefault(require("./strategies"));

var _adapters = _interopRequireDefault(require("./adapters"));

var _apiClient = _interopRequireDefault(require("./api-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createInstance = () => new _apiClient.default();

var _default = createInstance();

exports.default = _default;