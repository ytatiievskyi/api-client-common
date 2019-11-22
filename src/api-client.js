import { http } from './providers'
import { AuthAdapter } from './adapters'
import { JWTAuthStrategy } from './strategies'

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
    this.strategies = strategies

    this.init()
  }

  init() {
    const { store, providers, adapters, strategies } = this

    if (providers.http == null) {
      providers.http = http
    }
  
    if (adapters.auth == null) {
      adapters.auth = new AuthAdapter({ providers })
    }

    if ((strategies.auth == null) || (!Array.isArray(strategies.auth))) {
      strategies.auth = []
    }
    if (strategies.auth.length < 1) {
      const jwt = new JWTAuthStrategy({ store, adapters })
      strategies.auth.push(jwt)
    }
  
    strategies.auth.forEach(strategy =>
      strategy.bindHooksTo(adapters)
    )
    strategies.auth.forEach(strategy =>
      strategy.applyTo(providers)
    )
  }

  healthCheck() {
    return this.providers.http('/test').then(({ data }) => data)
  }
}