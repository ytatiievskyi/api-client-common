import defaultSettings from './auth.data'
import AbstractAdapter from './abstract'

const extractData = ({ data }) => data

export default class AuthAdapter extends AbstractAdapter {
  constructor(settings = {}) {
    const {
      path = defaultSettings.path,
      endpoints = defaultSettings.endpoints,
      providers = {}
    } = settings
    const { http } = providers
    if (http == null) {
      throw new Error('HTTP provider is required')
    }

    super()
    this.path = path
    this.endpoints = endpoints
    this.http = http
  }

  initHooks() {
    this.hooks.init([
      'SignUp',
      'SignIn',
      'SignOut',
      'RefreshToken',
    ])
    super.initHooks()
  }

  async signUp({ login, password }) {
    const { data } = await this.http.post(
      `${this.path}${this.endpoints.signUp}`,
      { login, password }
    )
    return this.hooks.after('SignUp').run(data)
  }

  async signIn({ login, password }) {
    const { data } = await this.http.post(
      `${this.path}${this.endpoints.signIn}`,
      { login, password }
    )
    return this.hooks.after('SignIn').run(data)
  }

  async signOut() {
    const { data } = await this.http.post(
      `${this.path}${this.endpoints.signOut}`,
      {}
    )
    return this.hooks.after('SignOut').run(data)
  }

  refreshToken({ refreshToken }) {
    return this.http
      .post(
        `${this.path}${this.endpoints.refreshToken}`,
        { refreshToken }
      )
      .then(extractData)
      .then(this.hooks.after('RefreshToken').run)
  }
  
  // async resetPassword() {
  //   const { data } = await this.http.post(
  //     `${this.path}${this.endpoints.resetPassword}`,
  //     {}
  //   )
  //   return data
  // }
}