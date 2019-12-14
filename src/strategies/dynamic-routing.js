import AbstractStrategy from './abstract'

export default class DynamicRoutingStrategy extends AbstractStrategy {

  bindHooksTo(adapters = {}) {
    const { coordinator } = adapters
    const updateStoreHook = this.updateStore.bind(this)

    if (coordinator == null) {
      throw new Error('Coordinator adapter is required')
    }
    coordinator.hooks
      .after('getServers', updateStoreHook)
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
    const { servers = [] } = data
    this.store.servers = [
      ...servers,
    ]
    return data
  }
}
