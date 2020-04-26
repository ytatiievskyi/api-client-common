import ApiModule from './api.module'

import { http } from '../channels'
import { AuthAdapter } from '../adapters'
import { JWTAuthStrategy } from '../strategies'

export default class JWTAuthModule extends ApiModule {
  get api() {
    return this.adapters.auth
  }

  createDefaults() {
    const { store, channels, adapters, strategies } = this

    if (channels.http == null) {
      channels.http = http
    }
  
    if (adapters.auth == null) {
      adapters.auth = new AuthAdapter({ channels })
    }

    if (strategies.auth == null) {
      strategies.auth = new JWTAuthStrategy({ store })
    }
  }
}