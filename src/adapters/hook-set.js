function createHandlerSet(hookSet) {
  const handlers = []
  return {
    add(handler) {
      if (typeof handler === 'function')
        handlers.push(handler)
      else
        throw new TypeError('function is required')
      return hookSet
    },
    run(data) {
      return handlers.reduce((params, handler) => {
        return handler(params)
      }, data)
    }
  }
}

function initStock(hookSet, stock) {
  return (methods) =>
    methods.forEach(method =>
      stock[method] = createHandlerSet(hookSet)
    )
}

function hooksByStock(stock) {
  return (...args) => {
    if (args.length < 1) {
      throw new TypeError('method name is required')
    }
    /* istanbul ignore next */
    const method = args[0]
    const handlerSet = stock[method]
    if (handlerSet == null) {
      throw new Error(`method ${method} is not registered`)
    }
    if (args.length < 2) {
      return handlerSet
    }
    /* istanbul ignore next */
    const hook = args[1]
    return handlerSet.add(hook)
  }
}

function createHookSet(names = ['before', 'after', 'error']) {

  const stock = {}
  names.forEach(name =>
    stock[name] = {}
  )

  const hookSet = {}

  hookSet.init = (methods) => {
    names.forEach(name =>
      initStock(hookSet, stock[name])(methods)
    )
    return hookSet
  }

  names.forEach(name =>
    hookSet[name] = hooksByStock(stock[name])
  )
  
  return hookSet
}

export default createHookSet

export {
  createHandlerSet,
  createHookSet,
}
