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
      'signUp',
      'signIn',
      'signOut',
      'refreshToken',
    ])
    super.initHooks()
  }

  async signUp({ username, password }) {
    const { data } = await this.http.post(
      `${this.path}${this.endpoints.signUp}`,
      { username, password }
    )
    return this.hooks.after('signUp').run(data)
  }

  async signIn({ username, password }) {
    const { data } = await this.http.post(
      `${this.path}${this.endpoints.signIn}`,
      { username, password }
    )
    return this.hooks.after('signIn').run(data)
  }

  async signOut() {
    const { data } = await this.http.post(
      `${this.path}${this.endpoints.signOut}`,
      {}
    )
    return this.hooks.after('signOut').run(data)
  }

  refreshToken({ refreshToken }) {
    return this.http
      .post(
        `${this.path}${this.endpoints.refreshToken}`,
        { refreshToken }
      )
      .then(extractData)
      .then(this.hooks.after('refreshToken').run)
  }
  
  // async resetPassword() {
  //   const { data } = await this.http.post(
  //     `${this.path}${this.endpoints.resetPassword}`,
  //     {}
  //   )
  //   return data
  // }
}