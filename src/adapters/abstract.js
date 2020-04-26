import createHookSet from './hook-set'

export default class AbstractAdapter {
  /* istanbul ignore next */
  constructor() {
    this.hooks = createHookSet()
    this.initHooks()
  }

  /* istanbul ignore next */
  initHooks() {}
}
