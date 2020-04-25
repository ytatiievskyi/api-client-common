# common-api-client

ApiClient holds the logic of interaction with other external services that are used in your application.
It allows you to segregate API calls from main application logic.

ApiClient consists of ApiModules which collects all API calls and other logic of interaction with particular backend service.

Each ApiModule consist of four basic components:
- `store` - an object to store module state or data such as tokens, account data, etc.
- `providers` - represents communication channels using protocols: http, ws, rpc, graphql, etc.
- `strategies` - defines how to apply specific logic to providers (setup auth headers, add request params etc.). Uses hooks to bind to adapters in order to extract necessary data.
- `adapters` - represents API of particular external service. Uses providers to communicate with them.

Also you can pass `options` and `dependencies` into ApiModules constructor `settings`.


## Install

> Install on Node.JS with [npm](https://www.npmjs.com/)

```bash
$ npm install --save common-api-client
```


## Usage

To create a new api-client:
```javascript
import { ApiClient } from 'common-api-client'

const client = new ApiClient()
const api = client.api
```
To use 'auth' module:
```javascript
// uses JWTAuthModule by default
await api.auth.signIn({ username, password })
```


To extend then functionality of ApiClinet you should define new ApiModules, Adapters, Strategies and so on:
```javascript
import { Client } from 'rpc-websockets'
import axios from 'axios'

import { ApiClient, modules } from 'common-api-client'
import { MyAuthStrategy } from './my-strategies'

import { MyAuthAdapter } from './my-adapters'

import {
  MyAccountModule,
  MyMessagesModule,
} from './my-modules'
const { JWTAuthModule } = modules

const store = {}

const http = axios.create()
const rpc = new Client('ws://localhost:8080')

const auth = new JWTAuthModule({
  providers: { http },
  adapters: {
    auth: new MyAuthAdapter({ providers: { http } }),
  },
  strategies: {
    auth: new MyAuthStrategy({ store }),
  }
})
const account = new MyAccountModule({
  providers: { http, rpc },
})
const messages = new MyMessagesModule({
  providers: { rpc },
})

const client = new ApiClient({
  modules: { auth, account, messages }
})
const api = client.api

await api.auth.signIn({ username, password })

// auth headers already setup to http request
await api.account.info()

// account_id already binded to rpc call
await api.messages.list()
```


## License

MIT © [Taras Panasyuk](webdev.taras@gmail.com)
