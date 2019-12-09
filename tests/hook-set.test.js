import test from 'ava'

import createHookSet from '../src/adapters/hook-set'

test.beforeEach(t => {
  t.context.hooks = createHookSet()
})

test('createHookSet() returns object with predefined methods', async t => {
  const { hooks } = t.context
  t.truthy(hooks.init)
  t.truthy(hooks.before)
  t.truthy(hooks.after)
  t.truthy(hooks.error)
})

test('createHookSet([]) returns object with defined methods', async t => {
  const names = ['m1', 'm2', 'm3', 'e1', 'e2']
  const hooks = createHookSet(names)
  
  t.true(typeof hooks.init === 'function')
  names.forEach(name =>
    t.true(typeof hooks[name] === 'function')
  )
})

test('Assigned to some method hooks run and return overall result', async t => {
  const { hooks } = t.context
  hooks.init(['method1', 'method2'])
  hooks.before('method2', n => n * 3)
  hooks.before('method2').add(n => n * 10)

  t.is(hooks.before('method1').run(3), 3)
  t.is(hooks.before('method2').run(3), 90)
})

test('Handler should be a function when adding a new hook', async t => {
  const { hooks } = t.context
  hooks.init(['method1'])

  const error = t.throws(() => {
    hooks.before('method1').add('something that is not a function')
  }, TypeError)
  t.is(error.message, 'function is required')
})

test('Method name should be specified when adding or getting hooks', async t => {
  const { hooks } = t.context

  const error = t.throws(() => {
    hooks.before().add(() => {})
  }, TypeError)
  t.is(error.message, 'method name is required')

  const err = t.throws(() => {
    hooks.before().run(3)
  }, TypeError)
  t.is(err.message, 'method name is required')
})

test('Method name should be registered before adding or getting hooks', async t => {
  const { hooks } = t.context
  const method = 'someMethod'

  const error = t.throws(() => {
    hooks.before(method).add(() => {})
  }, Error)
  t.is(error.message, `method ${method} is not registered`)

  const err = t.throws(() => {
    hooks.before(method).run(3)
  }, Error)
  t.is(err.message, `method ${method} is not registered`)
})
