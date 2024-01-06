import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventBus } from '.'

describe('eventBus', () => {
  let events: EventBus
  beforeEach(() => {
    events = new EventBus()
  })
  describe('on', () => {
    it('should register handle for new type', () => {
      const foo = () => {}
      events.on('foo', foo)
      expect(events.get('foo')).toEqual([foo])
    })

    it('should register handle for existing type', () => {
      const foo = () => {}
      const bar = () => {}
      events.on('foo', foo)
      events.on('foo', bar)
      expect(events.get('foo')).toEqual([foo, bar])
    })

    it('should can take symbols for event types', () => {
      const foo = () => {}
      const sym = Symbol('foo')
      events.on(sym, foo)
      expect(events.get(sym)).toEqual([foo])
    })

    it('should add duplicate listeners', () => {
      const foo = () => {}
      events.on('foo', foo)
      events.on('foo', foo)
      expect(events.get('foo')).toEqual([foo, foo])
    })
  })

  describe('off', () => {
    it('should remove handler for type', () => {
      const foo = () => {}
      events.on('foo', foo)
      events.off('foo', foo)
      expect(events.get('foo')).toEqual([])
    })

    it('should remain handler for type', () => {
      const foo = () => {}
      events.on('foo', foo)
      events.off('foo', () => {})
      expect(events.get('foo')).toMatchInlineSnapshot(`
        [
          [Function],
        ]
      `)
    })

    it('should remove only the first matching listener', () => {
      const foo = () => {}
      events.on('foo', foo)
      events.on('foo', foo)
      events.off('foo', foo)
      expect(events.get('foo')).toEqual([foo])
      events.off('foo', foo)
      expect(events.get('foo')).toEqual([])
    })

    it('off("type") should remove all handlers of the given type', () => {
      const foo = () => {}
      events.on('foo', foo)
      events.on('foo', foo)
      events.off('foo', foo)
      expect(events.get('foo')).toEqual([foo])
      events.off('foo', foo)
      expect(events.get('foo')).toEqual([])
    })
  })

  describe('emit', () => {
    it('should invoke handler for type', () => {
      const event = { a: 'b' }
      events.on('foo', (one, two?: unknown) => {
        expect(one).toEqual(event)
        expect(two).toBeUndefined()
      })

      events.emit('foo', event)
    })
  })

  describe('once', () => {
    it('should invoke handler for type once', () => {
      const event = { a: 'b' }
      const foo = vi.fn()
      events.once('foo', foo)

      events.emit('foo', event)
      events.emit('foo', event)
      expect(foo).toHaveBeenCalledTimes(1)
      expect(foo).toHaveBeenCalledWith(event)
    })

    it('should after invoke handler type deleted', () => {
      const event = { a: 'b' }
      const foo = vi.fn()
      events.once('foo', foo)

      events.emit('foo', event)
      expect(events.getOnce('foo')).toBeUndefined()
    })

    it('should invoke handler once and normal', () => {
      const foo = vi.fn()
      events.on('foo', foo)
      events.once('foo', foo)

      events.emit('foo')

      expect(events.get('foo')).toEqual([foo])
      expect(events.getOnce('foo')).toBeUndefined()
      expect(foo).toHaveBeenCalledTimes(2)
    })

    it('off should only remove same name in on function', () => {
      const foo = vi.fn()
      events.on('foo', foo)
      events.once('foo', foo)

      events.off('foo', foo)
      expect(events.get('foo')).toEqual([])
      expect(events.getOnce('foo')).toEqual([foo])
    })
  })

  describe('offOnce', () => {
    it('should remove once when once not invoke', () => {
      const foo = () => {}
      events.once('foo', foo)

      events.offOnce('foo')
      expect(events.getOnce('foo')).toBeUndefined()
    })
  })
})
