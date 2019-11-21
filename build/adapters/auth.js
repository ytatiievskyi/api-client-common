"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = _interopRequireDefault(require("./auth.data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const stub = data => data;

const extractData = ({
  data
}) => data;

class AuthAdapter {
  constructor({
    path,
    endpoints,
    providers
  }) {
    this.path = path || _auth.default.path;
    this.endpoints = endpoints || _auth.default.endpoints;
    const {
      http
    } = providers;

    if (http == null) {
      throw new Error('HTTP provider is required');
    }

    this.http = http;
    this.afterSignUp = stub;
    this.afterSignIn = stub;
    this.afterRefreshToken = stub;
    this.afterSignOut = stub;
  }

  async signUp({
    login,
    password
  }) {
    const {
      data
    } = await this.http.post(`${this.path}${this.endpoints.signUp}`, {
      login,
      password
    });
    return this.afterSignUp(data);
  }

  async signIn({
    login,
    password
  }) {
    const {
      data
    } = await this.http.post(`${this.path}${this.endpoints.signIn}`, {
      login,
      password
    });
    return this.afterSignIn(data);
  }

  async signOut() {
    const {
      data
    } = await this.http.post(`${this.path}${this.endpoints.signOut}`, {});
    return this.afterSignOut(data);
  }

  refreshToken({
    refreshToken
  }) {
    return this.http.post(`${this.path}${this.endpoints.refreshToken}`, {
      refreshToken
    }).then(extractData).then(this.afterRefreshToken);
  } // async resetPassword() {
  //   const { data } = await this.http.post(
  //     `${this.path}${this.endpoints.resetPassword}`,
  //     {}
  //   )
  //   return data
  // }


}

exports.default = AuthAdapter;