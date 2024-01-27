import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StateMachine } from '.'

const enum States {
  Start,
  DragStart,
  Moving,
  Stoped,
  Selected,
  PlacingComponent,
  AddingComponent,
}

const enum Actions {
  AUTO,
  EvtDragStart,
  EvtDrag,
  EvtDrop,
  EvtDragEnd,
  StartAddComponent,
}

describe('stateMachine', () => {
  class Editor extends StateMachine<States, Actions> {
    constructor() {
      super(States.Start)
      // 应该在构造函数内完成注册
      // 单测就跳过这一步
    }
  }
  let editor: Editor
  beforeEach(() => {
    editor = new Editor()
  })

  describe('register', () => {
    it('should register init', () => {
      const transFn = () => {}
      editor.register(States.Start, States.DragStart, Actions.EvtDragStart, transFn)

      expect(editor.table.size).toBe(1)
      expect(editor.table.get(States.Start)!.get(Actions.EvtDragStart)).toEqual([transFn, States.DragStart])
    })

    it('should register other state', () => {
      const transFn = () => {}
      editor.register(States.Start, States.DragStart, Actions.EvtDragStart, transFn)
      editor.register(States.DragStart, States.Moving, Actions.EvtDrag, transFn)
      expect(editor.table.size).toBe(2)
      expect(editor.table.get(States.DragStart)!.get(Actions.EvtDrag)).toEqual([transFn, States.Moving])
    })
  })

  describe('dispatch', () => {
    it('should dispatch EvtDragStart with a object', () => {
      const mock = vi.fn()
      editor.register(States.Start, States.DragStart, Actions.EvtDragStart, mock)
      const payload = { aa: 2 }
      editor.dispatch(Actions.EvtDragStart, payload)

      expect(mock).toBeCalledWith(payload)
    })

    it('should dispatch EvtDragStart with some value', () => {
      const mock = vi.fn()
      editor.register(States.Start, States.DragStart, Actions.EvtDragStart, mock)
      const payload = [1, 2, 3]
      editor.dispatch(Actions.EvtDragStart, ...payload)

      expect(mock).toBeCalledWith(...payload)
    })

    it('should dispatch invoke auto at last', async () => {
      const mock = vi.fn()
      editor.register(States.Start, States.DragStart, Actions.EvtDragStart, mock)
      editor.register(States.DragStart, States.Moving, Actions.EvtDrag, mock)
      editor.register(States.Moving, States.Moving, Actions.EvtDrag, mock)
      editor.register(States.Moving, States.Stoped, Actions.EvtDragEnd, mock)
      editor.register(States.Stoped, States.Start, Actions.AUTO, mock)
      editor.register(States.DragStart, States.Selected, Actions.EvtDragEnd, mock)
      await editor.dispatch(Actions.EvtDragStart)
      expect(editor.curState).toBe(States.DragStart)
      await editor.dispatch(Actions.EvtDrag)
      expect(editor.curState).toBe(States.Moving)
      await editor.dispatch(Actions.EvtDragEnd)
      expect(editor.curState).toBe(States.Start)
    })

    it('should sync dispatch invoke auto at last', () => {
      const mock = vi.fn()
      editor.register(States.Start, States.DragStart, Actions.EvtDragStart, mock)
      editor.register(States.DragStart, States.Moving, Actions.EvtDrag, mock)
      editor.register(States.Moving, States.Moving, Actions.EvtDrag, mock)
      editor.register(States.Moving, States.Stoped, Actions.EvtDragEnd, mock)
      editor.register(States.Stoped, States.Start, Actions.AUTO, mock)
      editor.register(States.DragStart, States.Selected, Actions.EvtDragEnd, mock)
      editor.dispatchSync(Actions.EvtDragStart)
      expect(editor.curState).toBe(States.DragStart)
      editor.dispatchSync(Actions.EvtDrag)
      editor.dispatchSync(Actions.EvtDragEnd)
      expect(editor.curState).toBe(States.Start)
    })
  })
})
