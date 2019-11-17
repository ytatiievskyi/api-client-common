import defaultProviders from './providers'

export default class ApiClient {
  constructor(settings = {}) {
    const {
      store = {},
      providers = {},
      auth = {}
    } = settings

    this.providers = providers
    this.accessToken = settings.accessToken
    this.refreshToken = settings.refreshToken
    this.refreshRequest = null

    this.init()

    this.providers.http.interceptors.request.use(
      config => {
        // const token = store.accessToken
        if (!this.accessToken) {
          return config
        }

        const newConfig = {
          headers: {},
          ...config,
        }

        newConfig.headers.Authorization = `Bearer ${this.accessToken}`
        return newConfig
      },
      e => Promise.reject(e)
    )

    this.providers.http.interceptors.response.use(
      r => r,
      async error => {
        if (
          !this.refreshToken ||
          error.response.status !== 401 ||
          error.config.retry
        ) {
          throw error
        }

        if (!this.refreshRequest) {
          this.refreshRequest = this.providers.http.post('/auth/refresh', {
            refreshToken: this.refreshToken,
          })
        }
        const { data } = await this.refreshRequest
        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken
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
  }

  async signIn({ login, password }) {
    const { data } = await this.providers.http.post('/auth/login', { login, password })
    this.accessToken = data.accessToken
    this.refreshToken = data.refreshToken
  }

  signOut() {
    this.accessToken = null
    this.refreshToken = null
  }

  healthCheck() {
    return this.providers.http('/test').then(({ data }) => data)
  }
}