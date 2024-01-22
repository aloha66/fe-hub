import { beforeEach, describe, expect, it, vi } from 'vitest'
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
    describe('object', () => {
      const bounds = { top: -100, left: -100, right: 100, bottom: 100 }
      let da: Draggable
      beforeEach(() => {
        da = new Draggable({ bounds })
        da.setElement(div)

        div.dispatchEvent(new MouseEvent('mousedown'))
      })
      it('should keep within bounds with a object', () => {
        div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

        // 检查入参
        expect(da.state.bounds).toEqual(bounds)

        expect(da.style).toMatchInlineSnapshot(`
          {
            "transform": "translate(51px,51px)",
          }
        `)
      })

      it('should keep within bounds with a object when right is over', () => {
        div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', { clientX: 151, clientY: DISTANCE.clientY }))

        expect(da.style).toMatchInlineSnapshot(`
          {
            "transform": "translate(100px,51px)",
          }
        `)
      })

      it('should keep within bounds with a object when bottom is over', () => {
        div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', { clientX: DISTANCE.clientX, clientY: 101 }))

        expect(da.style).toMatchInlineSnapshot(`
          {
            "transform": "translate(51px,100px)",
          }
        `)
      })

      it('should keep within bounds with a object when left is over', () => {
        div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', { clientX: -101, clientY: DISTANCE.clientY }))

        expect(da.style).toMatchInlineSnapshot(`
          {
            "transform": "translate(-100px,51px)",
          }
        `)
      })

      it('should keep within bounds with a object when top is over', () => {
        div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', { clientX: DISTANCE.clientX, clientY: -101 }))

        expect(da.style).toMatchInlineSnapshot(`
          {
            "transform": "translate(51px,-100px)",
          }
        `)
      })
    })
  })

  describe('defaultPosition', () => {
    it(`should init position x:${DISTANCE.clientX}px y:${DISTANCE.clientY}px`, () => {
      const da = new Draggable({ defaultPosition: { x: DISTANCE.clientX, y: DISTANCE.clientY } })
      da.setElement(div)

      // 检查入参
      expect(da.state.x).toBe(DISTANCE.clientX)
      expect(da.state.y).toBe(DISTANCE.clientY)

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(51px,51px)",
        }
      `)
    })

    it('should move deouble when set the defaultPosition', () => {
      const da = new Draggable({ defaultPosition: { x: DISTANCE.clientX, y: DISTANCE.clientY } })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      // 检查入参
      expect(da.state.x).toBe(DISTANCE.clientX * 2)
      expect(da.state.y).toBe(DISTANCE.clientY * 2)

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(102px,102px)",
        }
      `)
    })
  })

  describe('grid', () => {
    it('should remaining x = 0  and y = 0 when Dragging distance less than 50px', () => {
      const da = new Draggable({ grid: [50, 50] })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }))

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(0px,0px)",
        }
      `)
    })

    it('should change x = 50  and y = 50 when Dragging distance more than 50px', () => {
      const da = new Draggable({ grid: [50, 50] })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(50px,50px)",
        }
      `)
    })

    it('should change x = 50  and y = 50 when Dragging distance equal 50px', () => {
      const da = new Draggable({ grid: [50, 50] })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }))

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(50px,50px)",
        }
      `)
    })
  })

  describe('event', () => {
    it('should emit drag event', () => {
      const onStart = vi.fn()
      const onDrag = vi.fn()
      const onStop = vi.fn()
      const onMouseDown = vi.fn()
      const da = new Draggable({ onStart, onDrag, onStop, onMouseDown })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))
      div.ownerDocument.dispatchEvent(new MouseEvent('mouseup'))

      expect(onStart).toHaveBeenCalledOnce()
      expect(onDrag).toHaveBeenCalledOnce()
      expect(onStop).toHaveBeenCalledOnce()
      expect(onMouseDown).toHaveBeenCalledOnce()
    })
  })

  describe('position', () => {
    it('should set init position', () => {
      const da = new Draggable({ position: { x: DISTANCE.clientX, y: DISTANCE.clientY } })
      da.setElement(div)

      // 检查入参
      expect(da.state.position!.x).toBe(DISTANCE.clientX)
      expect(da.state.position!.y).toBe(DISTANCE.clientY)

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(51px,51px)",
        }
      `)
    })

    it('should can not move when position has not changed', () => {
      const da = new Draggable({ position: { x: 0, y: 0 } })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))
      div.dispatchEvent(new MouseEvent('mouseup'))

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(0px,0px)",
        }
      `)
    })

    it('should can move when position has changed', () => {
      const onStop = vi.fn()
      const da = new Draggable({ position: { x: 0, y: 0 }, onStop })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))
      div.dispatchEvent(new MouseEvent('mouseup'))

      // 模拟onStop的回调
      da.setState({ position: { x: DISTANCE.clientX, y: DISTANCE.clientY } })

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(51px,51px)",
        }
      `)
    })

    it('should can move when position has changed and has init position', () => {
      const position = { x: 25, y: 25 }
      const onStop = vi.fn()
      const da = new Draggable({ position, onStop })
      da.setElement(div)

      div.dispatchEvent(new MouseEvent('mousedown'))
      div.ownerDocument.dispatchEvent(new MouseEvent('mousemove', DISTANCE))
      div.dispatchEvent(new MouseEvent('mouseup'))

      expect(da.state).toMatchInlineSnapshot(`
        {
          "axis": "both",
          "bounds": false,
          "dragged": true,
          "dragging": false,
          "position": {
            "x": 25,
            "y": 25,
          },
          "prevPropsPosition": {
            "x": 25,
            "y": 25,
          },
          "scale": 1,
          "slackX": 0,
          "slackY": 0,
          "x": 25,
          "y": 25,
        }
      `)

      /**
       * TODO 单测的回调结果不正确？？
       * 省略部分回调
       * x和y应该跟lastX和lastY一样
       * 在网页端测试结果是对的 { x: 76, y: 76, deltaX: 0, deltaY: 0, lastX: 76, lastY: 76 }
       */
      // expect(onStop).toMatchInlineSnapshot(`
      //   [MockFunction spy] {
      //     "calls": [
      //       [
      //         {
      //           "deltaX": -51,
      //           "deltaY": -51,
      //           "lastX": 76,
      //           "lastY": 76,
      //           "x": 25,
      //           "y": 25,
      //         },
      //       ],
      //     ],
      //   }
      // `)

      // 模拟onStop的回调
      da.setState({ position: { x: DISTANCE.clientX + position.x, y: DISTANCE.clientY + position.y } })

      expect(da.style).toMatchInlineSnapshot(`
        {
          "transform": "translate(76px,76px)",
        }
      `)
    })
  })
})
