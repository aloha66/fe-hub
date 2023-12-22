import { describe, expect, it } from 'vitest'
import { DraggableCore } from '..'

describe('draggableCore', () => {
  it('should mounted when setElement success', () => {
    const dc = new DraggableCore()
    dc.setElement(document.createElement('div'))
    expect(dc.mounted).toBe(true)
  })

  it('should throw error when setElement fail', () => {
    const dc = new DraggableCore()

    expect(() => dc.setElement(null)).toThrowError('el is null')
    console.log(1)
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
})
