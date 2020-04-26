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
  
  instance[method] = wrapped.bind(instance)

  // TODO: need to consider several args not just the first
  function wrapped(param) {
    const onBefore = data => {
      hookSet.before(method).run(data)
      return hookSet.input(method).run(data)
    }
    const onAfter = data => {
      const output = hookSet.output(method).run(data)
      hookSet.after(method).run(output)
      return output
    }
    const onError = err => {
      hookSet.error(method).run(err)
      throw err
    }

    try {
      const input = onBefore(param)
      const result = prop.call(instance, input)
      return (result instanceof Promise)
        ? result.then(onAfter).catch(onError)
        : onAfter(result)
    } catch (error) {
      onError(error)
    }
  }
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
