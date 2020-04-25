export default class AbstractStrategy {
  /* istanbul ignore next */
  constructor(settings = {}) {
    const {
      store = {},
    } = settings

    this.store = store
    this.init()
  }

  /* istanbul ignore next */
  init() {}

  /* istanbul ignore next */
  bindHooksTo(adapters = {}) {
    throw new Error('Abstract method')
  }

  /* istanbul ignore next */
  applyTo(channels = {}) {
    throw new Error('Abstract method')
  }
}
