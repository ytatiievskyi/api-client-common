import defaultProviders from './providers'
import defaultAdapters from './adapters'

export default class ApiClient {
  constructor(settings = {}) {
    const {
      store = {},
      providers = {},
      adapters = {},
      strategies = {},
    } = settings

    this.store = store
    this.providers = providers
    this.adapters = adapters

    this.init()
  }

  init() {
    const { adapters, providers } = this
    const { http } = defaultProviders
    if (providers.http == null) {
      providers.http = http
    }
    const { AuthAdapter } = defaultAdapters
    if (adapters.auth == null) {
      adapters.auth = new AuthAdapter({ providers })
    }

    this.bindHooksTo(adapters)
    this.applyTo(providers)

    // this.strategies.forEach()
    // strategy.bindHooksTo(adapters)
    // strategy.applyTo(providers)
  }

  healthCheck() {
    return this.providers.http('/test').then(({ data }) => data)
  }

  bindHooksTo({ auth }) {
    if (auth == null) {
      throw new Error('Auth adapter is required')
    }
    const updateStoreHook = this.updateStore.bind(this)
    const clearStoreHook = this.clearStore.bind(this)

    auth.afterSignUp = updateStoreHook
    auth.afterSignIn = updateStoreHook
    auth.afterRefreshToken = updateStoreHook
    auth.afterSignOut = clearStoreHook
  }

  applyTo({ http }) {
    if (http == null) {
      throw new Error('HTTP provider is required')
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
          this.refreshRequest = this.adapters.auth.refreshToken({
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
    return data
  }

  clearStore(data) {
    this.store.accessToken = null
    this.store.refreshToken = null
    return data
  }
}