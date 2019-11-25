import * as adapters from './adapters'
import * as strategies from './strategies'
import ApiClient from './api-client'

const createInstance = () =>
  new ApiClient()

export default createInstance()

export {
  adapters,
  strategies,
  ApiClient,
}
