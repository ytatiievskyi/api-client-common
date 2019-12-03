import test from 'ava'

import { ApiClient } from '../src'

test('ApiClient.init() creates all necessary instances if it not passed into params', async t => {
  const client = new ApiClient()
  t.truthy(client.providers.http)
  t.truthy(client.adapters.auth)
  t.truthy(client.strategies.auth)
})

test('ApiClient.init() does not create new instances if option isCreateDefaults = false', async t => {
  const client = new ApiClient({
    options: { isCreateDefaults: false },
  })
  t.falsy(client.providers.http)
  t.falsy(client.adapters.auth)
  t.falsy(client.strategies.auth)
})

test('ApiClient.init() does not create new instances if it already passed into params', async t => {
  const http = {}
  const authAdapter = {}
  const authStrategy = {
    bindHooksTo: () => {},
    applyTo: () => {},
  }
  const client = new ApiClient({
    providers: { http },
    adapters: { auth: authAdapter },
    strategies: { auth: authStrategy },
  })
  t.is(client.providers.http, http)
  t.is(client.adapters.auth, authAdapter)
  t.is(client.strategies.auth, authStrategy)
})
