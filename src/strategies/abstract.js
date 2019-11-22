export default class AbstractStrategy {
  /* istanbul ignore next */
  constructor(settings = {}) {
    const {
      store = {},
      adapters = {},
    } = settings

    this.store = store
    this.adapters = adapters
  }

  /* istanbul ignore next */
  bindHooksTo(adapters = {}) {
    throw new Error('Abstract method')
  }

  /* istanbul ignore next */
  applyTo(providers = {}) {
    throw new Error('Abstract method')
  }
}
