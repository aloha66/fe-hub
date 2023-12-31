import { describe, expect, it, vi } from 'vitest'
import { DraggableCore } from '.'

describe('draggableCore', () => {
  it('should mounted when setElement success', () => {
    const dc = new DraggableCore()
    dc.setElement(document.createElement('div'))
    expect(dc.mounted).toBe(true)
  })

  it('should throw error when setElement fail', () => {
    const dc = new DraggableCore()

    expect(() => dc.setElement(null)).toThrowError('el is null')
    expect(dc.mounted).toBe(false)
  })

  it('should init DraggableCore state from options', () => {
    const payload = {
      allowAnyClick: true,
      handle: 'test',
    }
    const dc = new DraggableCore(payload)

    expect(dc.state.allowAnyClick).toBe(payload.allowAnyClick)
    expect(dc.state.cancel).toBe('')
    expect(dc.state.handle).toBe(payload.handle)
    expect(dc.state.disabled).toBe(false)
  })

  it('should return false when setElement twice', () => {
    const dc = new DraggableCore()
    dc.setElement(document.createElement('div'))
    expect(dc.setElement(document.createElement('div'))).toBe(false)
  })

  describe('can not move', () => {
    it('should not move when disabled is true', () => {
      const dc = new DraggableCore({ disabled: true })
      const div = document.createElement('div')
      dc.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))

      expect(dc.dragging).toBe(false)
      expect(dc.lastX).toBeNaN()
      expect(dc.lastY).toBeNaN()
    })

    it('should not move when cancel has selector', () => {
      const dc = new DraggableCore({ cancel: '.test' })
      const div = document.createElement('div')
      div.className = 'test'
      dc.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))

      expect(dc.dragging).toBe(false)
      expect(dc.lastX).toBeNaN()
      expect(dc.lastY).toBeNaN()
    })
  })
})
