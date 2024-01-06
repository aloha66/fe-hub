import { beforeEach, describe, expect, it } from 'vitest'
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

  // describe('off', () => {
  //   it('should remove handler for type', () => {
  //     const foo = () => {}
  //     events.on('foo', foo)
  //     events.off('foo', foo)
  //   })
  // })
})
