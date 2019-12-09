import AbstractStrategy from './abstract'

export default class DynamicRoutingStrategy extends AbstractStrategy {

  bindHooksTo(adapters = {}) {
    const { balancer } = adapters
    const updateStoreHook = this.updateStore.bind(this)

    if (balancer == null) {
      throw new Error('Balancer adapter is required')
    }
    balancer.afterGetServers = updateStoreHook
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
  
  updateStore(data) {
    const { servers = {} } = data
    const { servers: previous } = this.store
    this.store.servers = {
      ...previous,
      ...servers,
    }
    return data
  }
}
