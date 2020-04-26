import AbstractStrategy from './abstract'

export default class JWTAuthStrategy extends AbstractStrategy {
  constructor(settings) {
    super(settings)
  }

  init() {
    super.init()
  }

  bindHooksTo(adapters = {}) {
    const { auth } = adapters
    if (auth == null) {
      throw new Error('Auth adapter is required')
    }
    const updateStoreHook = this.updateStore.bind(this)
    const clearStoreHook = this.clearStore.bind(this)

    auth.hooks
      .after('signUp', updateStoreHook)
      .after('signIn', updateStoreHook)
      .after('refreshToken', updateStoreHook)
      .after('signOut', clearStoreHook)

    this.refreshTokenFunc = auth.refreshToken.bind(auth)
  }

  applyTo(channels = {}) {
    const { http } = channels
    if (http == null) {
      throw new Error('HTTP channel is required')
    }
    this.refreshRequest = null

    http.interceptors.request.use(
      config => {
        if (!this.store.accessToken) {
          return config
        }

        const newConfig = {
          headers: {},
          ...config,
        }

        newConfig.headers.Authorization = `Bearer ${this.store.accessToken}`
        return newConfig
      },
      e => Promise.reject(e)
    )

    http.interceptors.response.use(
      r => r,
      async error => {
        if (
          !this.store.refreshToken ||
          error.response.status !== 401 ||
          error.config.retry
        ) {
          throw error
        }

        if (!this.refreshRequest) {
          this.refreshRequest = this.refreshTokenFunc({
            refreshToken: this.store.refreshToken,
          })
        }
        await this.refreshRequest
        const newRequest = {
          ...error.config,
          retry: true,
        }

        return http(newRequest)
      }
    )
  }

  updateStore(data) {
    this.store.accessToken = data.accessToken
    this.store.refreshToken = data.refreshToken
  }

  clearStore(data) {
    this.store.accessToken = null
    this.store.refreshToken = null
  }
}
