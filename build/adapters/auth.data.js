"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  path: '/auth',
  endpoints: {
    signUp: '/register',
    signIn: '/login',
    signOut: '/logout',
    refreshToken: '/refresh-token',
    resetPassword: '/reset-password'
  }
};
exports.default = _default;