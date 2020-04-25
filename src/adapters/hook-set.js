// TODO: rewrite to classes
// TODO: separate into a standalone library

function createHandlerSet(hookSet) {
  const handlers = []
  // const loggers = []
  return {
    add(handler) {
      if (typeof handler === 'function')
        handlers.push(handler)
      else
        throw new TypeError('function is required')
      return hookSet
    },
    run(data) {
      // TODO: call logger
      // loggers.forEach(logger => {
      //   logger(instance, hookname, method, data)
      // })
      return handlers.reduce((params, handler) => {
        return handler(params)
      }, data)
    },
    // TODO: assign handler for logging calls and values
    // log(logger) { 
    //   if (typeof logger === 'function')
    //     loggers.push(logger)
    //   else
    //     throw new TypeError('function is required')
    //   return hookSet
    // }
  }
}

function initStock(hookSet, stock) {
  return (methods) =>
    methods.forEach(method =>
      stock[method] = createHandlerSet(hookSet)
    )
}

function wrapMethod(instance, method, hookSet, names) {
  const prop = instance[method]
  if (prop == null)
    throw new TypeError(`object ${instance} should has a property ${method}`)
  if (typeof prop !== 'function')
    throw new TypeError(`property ${method} should be a function`)
  
  // TODO: need to consider several args not just the first
  function wrapped(param) {
    const input = hookSet.input(method).run(param)
    hookSet.before(method).run(input)
    return prop.call(instance, param)
      .then(result => {
        hookSet.after(method).run(result)
        return result
      })
      .then(hookSet.output(method).run)
      .catch(err => {
        hookSet.error(method).run(err)
        return Promise.reject(err)
      })
  }
  
  instance[method] = wrapped.bind(instance)
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

function createHookSet(names = ['input', 'before', 'after', 'output',  'error']) {

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

  hookSet.wrap = (instance, methods) => {
    if (!(instance instanceof Object)) {
      throw new TypeError(`instance ${instance} should be an Object`)
    }
    names.forEach(name =>
      initStock(hookSet, stock[name])(methods)
    )
    methods.forEach(method =>
      wrapMethod(instance, method, hookSet, names)
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
