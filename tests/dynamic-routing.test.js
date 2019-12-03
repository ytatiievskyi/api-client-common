import test from 'ava'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import store from './dynamic-routing.data'

import { ApiClient, strategies } from '../src'
const { DynamicRoutingStrategy } = strategies

test.beforeEach(t => {
  const http = axios.create()
  t.context.mock = new MockAdapter(http)
  const dynamicRouting = new DynamicRoutingStrategy({ store })
  t.context.client = new ApiClient({
    providers: { http },
    strategies: {
      dynamicRouting,
    },
  })
  t.context.api = t.context.client.adapters
})

test('DynamicRouting strategy adds baseURL to the request', async t => {
  const { mock, client } = t.context
  const { host } = store.servers[0]

  mock
    .onGet(`${host}/test`)
    .reply(200, true)

  const result = await client.healthCheck()

  t.is(result, true)
  t.is(mock.history.get.length, 1)
  const { baseURL } = mock.history.get[0]
  t.is(baseURL, host)
})
