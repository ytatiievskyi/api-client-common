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
      options = {},
      dependencies = {},
    } = settings

    this.store = store
    this.providers = providers
    this.adapters = adapters
    this.strategies = strategies
    this.options = options
    this.dependencies = dependencies

    this.init()
  }

  get api() {
    return this.adapters
  }

  init() {
    const { options: { isCreateDefaults = true }} = this

    if (isCreateDefaults) {
      this.createDefaults()
    }
    this.applyStrategies()
  }

  createDefaults() {
    const { store, providers, adapters, strategies } = this

    if (providers.http == null) {
      providers.http = http
    }
  
    if (adapters.auth == null) {
      adapters.auth = new AuthAdapter({ providers })
    }

    if (strategies.auth == null) {
      strategies.auth = new JWTAuthStrategy({ store: store.auth })
    }
  }

  applyStrategies() {
    const { providers, adapters, strategies } = this
    
    const strategyList = Object.keys(strategies)
      .map(key => strategies[key])

    strategyList.forEach(strategy =>
      strategy.bindHooksTo(adapters)
    )
    strategyList.forEach(strategy =>
      strategy.applyTo(providers)
    )
  }

  healthCheck() {
    return this.providers.http('/test').then(({ data }) => data)
  }
}