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

  describe('axis', () => {
    it('should move horizontally and vertically (default) when axis is both', () => {
      const da = new Draggable({ axis: 'both' })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      // 检查入参
      expect(da.state.axis).toBe('both')

      expect(da.state.x).toBe(DISTANCE.clientX)
      expect(da.state.y).toBe(DISTANCE.clientY)
    })

    it('should only move horizontally when axis is x', () => {
      const da = new Draggable({ axis: 'x' })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      // 检查入参
      expect(da.state.axis).toBe('x')

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(51px,0px)",
        }
      `)
    })

    it('should only move vertically when axis is y', () => {
      const da = new Draggable({ axis: 'y' })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      // 检查入参
      expect(da.state.axis).toBe('y')

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(0px,51px)",
        }
      `)
    })
  })

  describe('bounds', () => {
    const bounds = { top: -100, left: -100, right: 100, bottom: 100 }
    it('should not move beyond bounds with a object without over the bounds', () => {
      const da = new Draggable({ bounds })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      // 检查入参
      expect(da.state.bounds).toEqual(bounds)

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(51px,51px)",
        }
      `)
    })

    it('should not move beyond bounds with a object over right', () => {
      const da = new Draggable({ bounds })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', { clientX: 151, clientY: DISTANCE.clientY }))

      // 检查入参
      expect(da.state.bounds).toEqual(bounds)

      // TODO
      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(51px,51px)",
        }
      `)
    })
  })
})
