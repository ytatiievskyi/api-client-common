import test from 'ava'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { ApiClient, adapters, modules } from '../src'

const { JWTAuthModule } = modules

test.beforeEach(t => {
  const http = axios.create()
  const auth = new JWTAuthModule({ channels: { http } })

  t.context.http = http
  t.context.mock = new MockAdapter(http)
  t.context.client = new ApiClient({ modules: { auth } })
  t.context.api = t.context.client.api
})

test('auth.signUp() retrieves tokens and adds it to header', async t => {
  const { mock, client, api } = t.context
  const LOGIN_REQUEST = {
    username: 'user',
    password: 'secret',
  }
  const LOGIN_RESPONSE = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  }

  mock
    .onPost('/auth/register', LOGIN_REQUEST)
    .reply(200, LOGIN_RESPONSE)
  mock
    .onGet('/test')
    .reply(200, true)

  await api.auth.signUp(LOGIN_REQUEST)
  await client.healthCheck()

  t.is(mock.history.get.length, 1)
  t.is(
    mock.history.get[0].headers.Authorization,
    `Bearer ${LOGIN_RESPONSE.accessToken}`
  )
})

test('auth.signIn() retrieves tokens and adds it to header', async t => {
  const { mock, client, api } = t.context
  const LOGIN_REQUEST = {
    username: 'user',
    password: 'secret',
  }
  const LOGIN_RESPONSE = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  }

  mock
    .onPost('/auth/login', LOGIN_REQUEST)
    .reply(200, LOGIN_RESPONSE)
  mock
    .onGet('/test')
    .reply(200, true)

  await api.auth.signIn(LOGIN_REQUEST)
  await client.healthCheck()

  t.is(mock.history.get.length, 1)
  t.is(
    mock.history.get[0].headers.Authorization,
    `Bearer ${LOGIN_RESPONSE.accessToken}`
  )
})

test('auth.signOut() removes tokens', async t => {
  const { mock, client, api } = t.context
  const LOGIN_REQUEST = {
    username: 'user',
    password: 'secret',
  }
  const LOGIN_RESPONSE = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  }

  mock
    .onPost('/auth/login', LOGIN_REQUEST)
    .reply(200, LOGIN_RESPONSE)
  mock
    .onPost('/auth/logout')
    .reply(200, true)
  mock
    .onGet('/test')
    .reply(200, true)

  await api.auth.signIn(LOGIN_REQUEST)
  await api.auth.signOut()
  await client.healthCheck()

  t.is(mock.history.get.length, 1)
  t.falsy(mock.history.get[0].headers.Authorization)
})

test('Retries request with a new access token if got 401 error before', async t => {
  const { mock, client, api } = t.context
  const LOGIN_REQUEST = {
    username: 'user',
    password: 'secret',
  }
  const LOGIN_RESPONSE = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  }

  const REFRESH_REQUEST = {
    refreshToken: LOGIN_RESPONSE.refreshToken,
  }
  const REFRESH_RESPONSE = {
    accessToken: 'ACCESS_TOKEN2',
    refreshToken: 'REFRESH_TOKEN2',
  }

  mock
    .onPost('/auth/login', LOGIN_REQUEST)
    .reply(200, LOGIN_RESPONSE)
  mock
    .onPost('/auth/refresh-token', REFRESH_REQUEST)
    .replyOnce(200, REFRESH_RESPONSE)
  mock
    .onGet('/test')
    .reply(config => {
      const { Authorization: auth } = config.headers
      
      if (auth === `Bearer ${LOGIN_RESPONSE.accessToken}`) {
        return [401]
      }
      if (auth === `Bearer ${REFRESH_RESPONSE.accessToken}`) {
        return [200, true]
      }
      return [404]
    })

  await api.auth.signIn(LOGIN_REQUEST)
  await client.healthCheck()

  t.is(mock.history.get.length, 2)
  t.is(
    mock.history.get[1].headers.Authorization,
    `Bearer ${REFRESH_RESPONSE.accessToken}`
  )
})

test('Request fails if got a 404 error', async t => {
  const { mock, client } = t.context
  mock.onGet('/test').reply(404)
  await t.throwsAsync(client.healthCheck())
})

test('Request fails if got an error before request interceptor', async t => {
  const { http, mock, client } = t.context
  const api = client.api

  http.interceptors.request.use(
    () => {
      throw new Error('Test error')
    },
    e => Promise.reject(e)
  )

  const LOGIN_REQUEST = {
    username: 'user',
    password: 'secret',
  }
  const LOGIN_RESPONSE = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  }

  mock
    .onPost('/auth/login', LOGIN_REQUEST)
    .reply(200, LOGIN_RESPONSE)

  await t.throwsAsync(
    api.auth.signIn(LOGIN_REQUEST),
    {instanceOf: Error, message: 'Test error'}
  )
})

test('Requests calling for refresh token just once', async t => {
  const { mock, client, api } = t.context
  const LOGIN_REQUEST = {
    username: 'user',
    password: 'secret',
  }
  const LOGIN_RESPONSE = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  }

  const REFRESH_REQUEST = {
    refreshToken: LOGIN_RESPONSE.refreshToken,
  }
  const REFRESH_RESPONSE = {
    accessToken: 'ACCESS_TOKEN2',
    refreshToken: 'REFRESH_TOKEN2',
  }

  mock
    .onPost('/auth/login', LOGIN_REQUEST)
    .reply(200, LOGIN_RESPONSE)
  mock
    .onPost('/auth/refresh-token', REFRESH_REQUEST)
    .replyOnce(200, REFRESH_RESPONSE)
  mock
    .onGet('/test')
    .reply(config => {
      const { Authorization: auth } = config.headers
      if (auth === `Bearer ${LOGIN_RESPONSE.accessToken}`) {
        return [401]
      }
      if (auth === `Bearer ${REFRESH_RESPONSE.accessToken}`) {
        return [200, true]
      }
      return [404]
    })

  await api.auth.signIn(LOGIN_REQUEST)
  await Promise.all([client.healthCheck(), client.healthCheck()])
  t.is(
    mock.history.post.filter(({ url }) => url === '/auth/refresh-token').length,
    1
  )
})

test('Http channel should be specified when creating a new AuthAdapter', async t => {
  const { AuthAdapter } = adapters

  const error = t.throws(() => {
    new AuthAdapter()
  }, {instanceOf: Error})
  t.is(error.message, 'HTTP channel is required')
})
