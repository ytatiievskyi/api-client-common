import ApiModule from './api.module'

import { http } from '../providers'
import { AuthAdapter } from '../adapters'
import { JWTAuthStrategy } from '../strategies'

export default class JWTAuthModule extends ApiModule {
  get api() {
    return this.adapters.auth
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
      strategies.auth = new JWTAuthStrategy({ store })
    }
  }
}