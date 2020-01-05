import { JWTAuthModule } from './modules'

export default class ApiClient {
  constructor(settings = {}) {
    const {
      modules = {},
      options = {},
    } = settings

    this.modules = modules
    this.options = options
    this.api = {}
    
    this.init()
  }

  init() {
    const {
      options: { isCreateDefaults = true },
      modules,
    } = this

    if (isCreateDefaults) {
      this.createDefaults()
    }

    this.api = Object.keys(modules)
      .reduce((obj, key) => {
        obj[key] = modules[key].api
        return obj
      }, {})
  }

  createDefaults() {
    const { modules } = this
    if (modules.auth == null) {
      modules.auth = new JWTAuthModule()
    }
  }

  healthCheck() {
    const { modules } = this
    const results = Object.keys(modules)
      .map(key => modules[key])
      .map(m => m.healthCheck())
    return Promise.all(results)
  }
}