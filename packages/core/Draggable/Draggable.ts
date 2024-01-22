import { createCSSTransform } from '@fe-hub/shared'
import type { DraggableCoreOptions } from '../DraggableCore'
import { DraggableCore } from '../DraggableCore'
import type { ControlPosition, DraggableEventHandler } from '../DraggableCore/type'
import { canDragX, canDragY, createDraggableData, getBoundPosition } from '../DraggableCore/position'
import type { Handler } from '..'
import { EventBus } from '..'
import type { DraggableState } from './type'

interface InternalState {
  dragging: boolean
  dragged: boolean
  /**
   * 当前坐标x
   */
  x: number
  /**
   * 当前坐标y
   */
  y: number
  prevPropsPosition: ControlPosition
  /**
   * 补偿越界拖动
   */
  slackX: number
  /**
   * 补偿越界拖动
   */
  slackY: number

}

export type FinalState = DraggableState & InternalState
type MergedOptions = DraggableCoreOptions & DraggableState

export interface DraggableOptions extends MergedOptions {
}

export interface StateChangeOptions {
  newState: unknown
  newStyle: {
    transform: string
  }
}

export type StateChangeHandler = Handler<StateChangeOptions>

const STATECHANGE = 'stateChange'

export class Draggable {
  isElementSVG = false
  #core: DraggableCore
  #options: DraggableOptions = {}
  #state: FinalState = {
    dragged: false,
    dragging: false,
    prevPropsPosition:
      { x: 0, y: 0 },
    slackX: 0,
    slackY: 0,
    x: 0,
    y: 0,
    scale: 1,

  }

  #eventBus = new EventBus()

  constructor(options: DraggableOptions = {}) {
    const { onStart: _onStart, onDrag: _onDrag, onStop: _onStop, ...rest } = options
    this.#core = new DraggableCore(rest)
    const {
      axis = 'both',
      bounds = false,
      defaultClassName = 'react-draggable',
      defaultClassNameDragging = 'react-draggable-dragging',
      defaultClassNameDragged = 'react-draggable-dragged',
      defaultPosition = { x: 0, y: 0 },
    } = options

    const { position, onDrag, onStop, scale = 1 } = options
    this.#options = options
    this.#options.axis = axis
    this.#options.bounds = bounds
    this.#options.defaultClassName = defaultClassName
    this.#options.defaultClassNameDragging = defaultClassNameDragging
    this.#options.defaultClassNameDragged = defaultClassNameDragged
    // 记录原始位置
    this.#options.defaultPosition = defaultPosition

    if (position && !(onDrag || onStop)) {
      console.warn('A `position` was applied to this <Draggable>, without drag handlers. This will make this '
      + 'component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the '
      + '`position` of this element.')
    }

    const pos = {
      x: position ? position.x : defaultPosition.x,
      y: position ? position.y : defaultPosition.y,
    }

    this.setState({
      ...pos,
      prevPropsPosition: { ...pos },
      bounds,
      axis,
      scale,
      position,
    })
  }

  get controlled() {
    return !!this.#options.position
  }

  get draggable() {
    return !this.controlled || this.#state.dragging
  }

  get state() {
    return this.#state
  }

  get style() {
    return createCSSTransform(this.#getTransformOpts(), this.#state.positionOffset)
  }

  onStateChange(callback: any) {
    this.#eventBus.on(STATECHANGE, callback)
  }

  setState(payload: Partial<FinalState>) {
    this.#state = { ...this.#state, ...payload }
    this.#core.setState(this.#state)
    this.#eventBus.emit(STATECHANGE, { newState: this.#state, newStyle: this.style })
  }

  setElement(el: HTMLElement | null) {
    if (!el)
      throw new Error('el is null')

    this.#initCore(el)
    if (typeof window.SVGElement !== 'undefined' && el instanceof window.SVGElement)
      this.isElementSVG = true
  }

  onDragStart: DraggableEventHandler = (coreData, e) => {
    const shouldStart = this.#options.onStart?.(createDraggableData(this.#state, coreData), e)
    if (shouldStart === false)
      return false

    this.setState({ dragging: true, dragged: true })
  }

  onDrag: DraggableEventHandler = (coreData, e) => {
    if (!this.#state.dragging)
      return false

    const uiData = createDraggableData(this.#state, coreData)

    const newState = {
      x: uiData.x,
      y: uiData.y,
      slackX: 0,
      slackY: 0,
    }

    // Keep within bounds.
    if (this.#state.bounds) {
      // Save original x and y.
      const { x, y } = newState

      // Add slack to the values used to calculate bound position. This will ensure that if
      // we start removing slack, the element won't react to it right away until it's been
      // completely removed.
      // 元素超出边界的部分加到xy上
      // 计算边界的时候，元素不会对slack的移除立即做出反应
      newState.x += this.#state.slackX
      newState.y += this.#state.slackY

      // Get bound position. This will ceil/floor the x and y within the boundaries.
      const [newStateX, newStateY] = getBoundPosition(this.#state, newState.x, newState.y, this.#core.el!)
      newState.x = newStateX
      newState.y = newStateY

      // Recalculate slack by noting how much was shaved by the boundPosition handler.
      // 重新计算 slack，
      // 将原始的 x 和 y 与新的 x 和 y 的差值加到原始的 slackX 和 slackY 上。
      // 这样做的目的是记录由于边界处理而减少的部分
      newState.slackX = this.#state.slackX + (x - newState.x)
      newState.slackY = this.#state.slackY + (y - newState.y)

      // Update the event we fire to reflect what really happened after bounds took effect.
      uiData.x = newState.x
      uiData.y = newState.y
      uiData.deltaX = newState.x - this.#state.x
      uiData.deltaY = newState.y - this.#state.y
    }

    const shouldUpdate = this.#options.onDrag?.(uiData, e)
    if (shouldUpdate === false)
      return false

    this.setState(newState)
  }

  onDragStop: DraggableEventHandler = (coreData, e) => {
    if (!this.#state.dragging)
      return false

    const shouldUpdate = this.#options.onStop?.(createDraggableData(this.#state, coreData), e)
    if (shouldUpdate === false)
      return false

    const newState = {
      dragging: false,
      slackX: 0,
      slackY: 0,
      x: this.#state.x,
      y: this.#state.y,
    }

    // If this is a controlled component, the result of this operation will be to
    // revert back to the old position. We expect a handler on `onDragStop`, at the least.
    const controlled = Boolean(this.#state.position)
    if (controlled) {
      const { x, y } = this.#state.position!
      newState.x = x
      newState.y = y
    }

    this.setState(newState)
  }

  destory() {
    this.setState({ dragging: false }) // prevents invariant if unmounted while dragging
  }

  /**
   * 控制实际的style输出
   * 影响范围包括
   * 1. axix
   * 2. position(利用是否有初值来判断是否是受控组件)
   * @returns
   */
  #getTransformOpts() {
    const validPosition = this.#state.position || this.#options.defaultPosition

    return {
      // Set left if horizontal drag is enabled
      x: canDragX(this.#state) && this.draggable
        ? this.#state.x
        : validPosition!.x,

      // Set top if vertical drag is enabled
      y: canDragY(this.#state) && this.draggable
        ? this.#state.y
        : validPosition!.y,
    }
  }

  #initCore = (el: HTMLElement) => {
    this.#core.setElement(el)
    this.#core.initState(this.#options)
    this.#core.setEvent('onStart', this.onDragStart)
    this.#core.setEvent('onDrag', this.onDrag)
    this.#core.setEvent('onStop', this.onDragStop)
  }
}
