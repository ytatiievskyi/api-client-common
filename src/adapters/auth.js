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
    this.hooks.wrap(this, [
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
    return data
  }

  async signIn({ username, password }) {
    const { data } = await this.http.post(
      `${this.path}${this.endpoints.signIn}`,
      { username, password }
    )
    return data
  }

  async signOut() {
    const { data } = await this.http.post(
      `${this.path}${this.endpoints.signOut}`,
      {}
    )
    return data
  }

  refreshToken({ refreshToken }) {
    return this.http
      .post(
        `${this.path}${this.endpoints.refreshToken}`,
        { refreshToken }
      )
      .then(extractData)
  }
  
  // async resetPassword() {
  //   const { data } = await this.http.post(
  //     `${this.path}${this.endpoints.resetPassword}`,
  //     {}
  //   )
  //   return data
  // }
}