import test from 'ava'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import store from './dynamic-routing/store.data'
import getServersData from './dynamic-routing/get-servers'

import { ApiClient, strategies } from '../src'
const { DynamicRoutingStrategy } = strategies

test.beforeEach(t => {
  const http = axios.create()
  t.context.mock = new MockAdapter(http)

  const balancer = {
    afterGetServers: ({ data }) => data,
    getServers() {
      return this.afterGetServers(getServersData)
    }
  }
  
  const dynamicRouting = new DynamicRoutingStrategy({ store })
  
  t.context.client = new ApiClient({
    providers: { http },
    adapters: { balancer },
    strategies: {
      dynamicRouting,
    },
  })
  t.context.api = t.context.client.api
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

test('DynamicRouting strategy adds new baseURL to the request after balancer updates server list', async t => {
  const { mock, client, api } = t.context
  const { host } = store.servers[0]
  const { host: newHost } = getServersData.servers[0]

  mock
    .onGet(`${host}/test`)
    .reply(200, true)
  mock
    .onGet(`${newHost}/test`)
    .reply(200, true)

  const result = await client.healthCheck()
  await api.balancer.getServers()
  const newResult = await client.healthCheck()

  t.is(result, true)
  t.is(newResult, true)
  t.is(mock.history.get.length, 2)
  const { baseURL } = mock.history.get[0]
  t.is(baseURL, host)
  const { baseURL: newBaseURL } = mock.history.get[1]
  t.is(newBaseURL, newHost)
})
