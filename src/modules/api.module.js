export default class ApiModule {
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
    const {
      options: { isCreateDefaults = true },
      strategies,
    } = this

    if (isCreateDefaults) {
      this.createDefaults()
    }
    const strategyList = Object.keys(strategies)
      .map(key => strategies[key])
    this.initStrategies(strategyList)
  }

  createDefaults() {}

  initStrategies(strategyList = []) {
    const { providers, adapters } = this
    
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