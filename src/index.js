import strategies from './strategies'
import adapters from './adapters'
import ApiClient from './api-client'

const createInstance = () =>
  new ApiClient()

export default createInstance()

export {
  ApiClient,
  strategies,
  adapters,
}
