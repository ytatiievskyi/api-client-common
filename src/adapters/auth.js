import defaultSettings from './auth.data'

export default class AuthAdapter {
  constructor({ path, endpoints, providers }) {
    this.path = path || defaultSettings.path
    this.endpoints = endpoints || defaultSettings.endpoints
    this.providers = providers
  }

  async signUp({ login, password }) {
    const { data } = await this.providers.http.post(
      `/${this.path}/${this.endpoints.signUp}`,
      { login, password }
    )
    return data
  }

  async signIn({ login, password }) {
    const { data } = await this.providers.http.post(
      `/${this.path}/${this.endpoints.signIn}`,
      { login, password }
    )
    return data
  }

  async signOut() {
    const { data } = await this.providers.http.post(
      `/${this.path}/${this.endpoints.signOut}`,
      {}
    )
    return data
  }

  refreshToken({ refreshToken }) {
    return this.providers.http.post(
      `/${this.path}/${this.endpoints.refreshToken}`,
      { refreshToken }
    )
  }
  
  async resetPassword() {
    const { data } = await this.providers.http.post(
      `/${this.path}/${this.endpoints.resetPassword}`,
      {}
    )
    return data
  }
}