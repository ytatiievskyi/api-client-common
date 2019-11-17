import axios from 'axios'

export default class ApiClient {
  constructor(options = {}) {
    // const { store = {} } = options

    this.client = options.client || axios.create()
    this.accessToken = options.accessToken
    this.refreshToken = options.refreshToken
    this.refreshRequest = null

    this.client.interceptors.request.use(
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

    this.client.interceptors.response.use(
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
          this.refreshRequest = this.client.post('/auth/refresh', {
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

        return this.client(newRequest)
      }
    )
  }

  async signIn({ login, password }) {
    const { data } = await this.client.post('/auth/login', { login, password })
    this.accessToken = data.accessToken
    this.refreshToken = data.refreshToken
  }

  signOut() {
    this.accessToken = null
    this.refreshToken = null
  }

  healthCheck() {
    return this.client('/test').then(({ data }) => data)
  }
}