import test from 'ava'

import { ApiClient } from '../src'

test.beforeEach(t => {
  const adapters = {
    auth: {
      login() {},
      logout() {},
    },
    account: {
      create() {},
      update() {},
      remove() {},
    },
    event: {
      send() {},
      subscribe() {},
      list() {},
    },
  }

  const auth = {
    healthCheck() {
      return Promise.resolve(true)
    },
    get api() {
      return adapters.auth
    },
  }
  const account = {
    healthCheck() {
      return Promise.resolve('Good')
    },
    get api() {
      return adapters.account
    },
  }
  const event = {
    healthCheck() {
      return Promise.resolve('Connected')
    },
    get api() {
      return adapters.event
    },
  }

  t.context.adapters = adapters
  t.context.modules = { auth, account, event }
})

test('ApiClient() binds all necessary modules passed into params', async t => {
  const { modules } = t.context
  const client = new ApiClient({ modules })

  t.deepEqual(client.modules, modules)
})

test('ApiClient.init() creates all necessary instances if it not passed into params', async t => {
  const client = new ApiClient()
  t.truthy(client.modules.auth)
  t.truthy(client.api.auth)
})

test('ApiClient.init() does not create new instances if option isCreateDefaults = false', async t => {
  const client = new ApiClient({
    options: { isCreateDefaults: false },
  })
  t.falsy(client.modules.auth)
  t.falsy(client.api.auth)
})

test('ApiClient.init() does not create new instances if it already passed into params', async t => {
  const { modules } = t.context
  const client = new ApiClient({ modules })

  t.deepEqual(client.modules, modules)
  t.is(client.modules.auth, modules.auth)
})

test('ApiClient.api() getter returns api() for each module', async t => {
  const { modules, adapters } = t.context
  const client = new ApiClient({ modules })

  t.truthy(client.api)
  t.deepEqual(client.api.auth, adapters.auth)
  t.deepEqual(client.api.account, adapters.account)
  t.deepEqual(client.api.event, adapters.event)
})

test('ApiClient.healthCheck() calls healthCheck() method for each module and returns arrray of results', async t => {
  const { modules } = t.context
  const client = new ApiClient({ modules })

  const results = await client.healthCheck()
  t.deepEqual(results, [true, 'Good', 'Connected'])
})
