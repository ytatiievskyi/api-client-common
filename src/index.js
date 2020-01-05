import * as adapters from './adapters'
import * as strategies from './strategies'
import * as modules from './modules'
import ApiClient from './api-client'

const createInstance = () =>
  new ApiClient()

export default createInstance()

export {
  adapters,
  strategies,
  modules,
  ApiClient,
}
