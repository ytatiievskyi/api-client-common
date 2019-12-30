import test from 'ava'

import { modules } from '../src'
const { JWTAuthModule } = modules

test('JWTAuthModule.init() creates all necessary instances if it not passed into params', async t => {
  const client = new JWTAuthModule()
  t.truthy(client.providers.http)
  t.truthy(client.adapters.auth)
  t.truthy(client.strategies.auth)
})

test('JWTAuthModule.init() does not create new instances if option isCreateDefaults = false', async t => {
  const client = new JWTAuthModule({
    options: { isCreateDefaults: false },
  })
  t.falsy(client.providers.http)
  t.falsy(client.adapters.auth)
  t.falsy(client.strategies.auth)
})

test('JWTAuthModule.init() does not create new instances if it already passed into params', async t => {
  const http = {}
  const authAdapter = {}
  const authStrategy = {
    bindHooksTo: () => {},
    applyTo: () => {},
  }
  const client = new JWTAuthModule({
    providers: { http },
    adapters: { auth: authAdapter },
    strategies: { auth: authStrategy },
  })
  t.is(client.providers.http, http)
  t.is(client.adapters.auth, authAdapter)
  t.is(client.strategies.auth, authStrategy)
})

test('JWTAuthModule.applyStrategies() called without params does not throw any errors', async t => {
  const client = new JWTAuthModule({
    options: { isCreateDefaults: false },
  })

  t.notThrows(() => {
    client.applyStrategies()
  })
})
