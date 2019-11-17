import defaultProviders from './providers'

export default class ApiClient {
  constructor(settings = {}) {
    const {
      store = {},
      providers = {},
      auth = {}
    } = settings

    this.store = store
    this.providers = providers
    this.refreshRequest = null

    this.init()

    this.providers.http.interceptors.request.use(
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

    this.providers.http.interceptors.response.use(
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
          this.refreshRequest = this.providers.http.post('/auth/refresh', {
            refreshToken: this.store.refreshToken,
          })
        }
        const { data } = await this.refreshRequest
        this.store.accessToken = data.accessToken
        this.store.refreshToken = data.refreshToken
        const newRequest = {
          ...error.config,
          retry: true,
        }

        return this.providers.http(newRequest)
      }
    )
  }

  init() {
    const { http } = defaultProviders
    if (this.providers.http == null) {
      this.providers.http = http
    }
    // this.store.accessToken = null
    // this.store.refreshToken = null
  }

  async signIn({ login, password }) {
    const { data } = await this.providers.http.post('/auth/login', { login, password })
    this.store.accessToken = data.accessToken
    this.store.refreshToken = data.refreshToken
  }

  signOut() {
    this.store.accessToken = null
    this.store.refreshToken = null
  }

  healthCheck() {
    return this.providers.http('/test').then(({ data }) => data)
  }
}