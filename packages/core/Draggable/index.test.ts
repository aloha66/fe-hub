import { beforeEach, describe, expect, it } from 'vitest'
import { MouseEventButtonEnum } from '@fe-hub/shared'
import { Draggable } from '.'

const DISTANCE = { clientX: 51, clientY: 51 }

describe('draggable', () => {
  let div: HTMLDivElement
  beforeEach(() => {
    div = document.createElement('div')
  })

  describe('allowAnyClick', () => {
    it('should move when allowAnyClick is undefined', () => {
      const da = new Draggable()
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      expect(da.state.x).toBe(DISTANCE.clientX)
      expect(da.state.y).toBe(DISTANCE.clientY)
    })

    it('should not move when allowAnyClick is undefined and right mousedown', () => {
      const da = new Draggable()

      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown', { button: MouseEventButtonEnum.RIGHT }))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      expect(da.state.x).toBe(0)
      expect(da.state.y).toBe(0)
    })

    it('should move when allowAnyClick is true and right mousedown', () => {
      const da = new Draggable({ allowAnyClick: true })

      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown', { button: MouseEventButtonEnum.RIGHT }))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      expect(da.state.x).toBe(DISTANCE.clientX)
      expect(da.state.y).toBe(DISTANCE.clientY)
    })
  })
})
