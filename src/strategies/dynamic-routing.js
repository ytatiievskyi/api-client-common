import AbstractStrategy from './abstract'

export default class DynamicRoutingStrategy extends AbstractStrategy {

  bindHooksTo(adapters = {}) {
  }

  applyTo(providers = {}) {
    const { http } = providers
    if (http == null) {
      throw new Error('HTTP provider is required')
    }
    http.interceptors.request.use(
      config => {
        const { host } = this.store.servers[0]
        config.baseURL = host
        return config
      },
      e => Promise.reject(e)
    )
  }
}
