"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hookSet = _interopRequireDefault(require("./hook-set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AbstractAdapter {
  /* istanbul ignore next */
  constructor() {
    this.hooks = (0, _hookSet.default)();
    this.initHooks();
  }
  /* istanbul ignore next */


  initHooks() {}

}

exports.default = AbstractAdapter;