import { createCSSTransform } from '@fe-hub/shared'
import type { DraggableCoreOptions } from '../DraggableCore'
import { DraggableCore } from '../DraggableCore'
import type { ControlPosition, DraggableEventHandler } from '../DraggableCore/type'
import { canDragX, canDragY, createDraggableData, getBoundPosition } from '../DraggableCore/position'
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

export interface DraggableOptions extends MergedOptions { }

export class Draggable {
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

  get controlled() {
    return !!this.#options.position
  }

  get draggable() {
    return !this.controlled || this.#state.dragging
  }

  get style() {
    console.log('cache clear')
    return createCSSTransform(this.geTtransformOpts(), this.#state.positionOffset)
  }

  private stateChangeCallbacks: StateChangeCallback[] = []

  onStateChange(callback: StateChangeCallback) {
    this.stateChangeCallbacks.push(callback)
  }

  setState(payload: Partial<FinalState>) {
    this.#state = { ...this.#state, ...payload }
    this.stateChangeCallbacks.forEach(callback => callback(this.#state, this.style))
  }

  isElementSVG = false

  #initCore = (el: HTMLElement) => {
    this.#core.setElement(el)
    this.#core.setEvent('onStart', this.onDragStart)
    this.#core.setEvent('onDrag', this.onDrag)
    this.#core.setEvent('onStop', this.onDragStop)
  }

  setElement(el: HTMLElement | null) {
    if (!el)
      throw new Error('el is null')

    this.#initCore(el)
    if (typeof window.SVGElement !== 'undefined' && el instanceof window.SVGElement)
      this.isElementSVG = true
  }

  constructor(options: DraggableOptions = {}) {
    const { onStart: _onStart, onDrag: _onDrag, onStop: _onStop, ...rest } = options
    this.#core = new DraggableCore(rest)
    const { axis = 'both', bounds = false, defaultClassName = 'react-draggable', defaultClassNameDragging = 'react-draggable-dragging', defaultClassNameDragged = 'react-draggable-dragged', defaultPosition = { x: 0, y: 0 } } = options

    const { position, onDrag, onStop, scale = 1 } = options
    this.#options = options
    this.#options.axis = axis
    this.#options.bounds = bounds
    this.#options.defaultClassName = defaultClassName
    this.#options.defaultClassNameDragging = defaultClassNameDragging
    this.#options.defaultClassNameDragged = defaultClassNameDragged
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
    })
  }

  geTtransformOpts() {
    const validPosition = this.#state.position || this.#state.defaultPosition
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

  onDragStart: DraggableEventHandler = (e, coreData) => {
    const shouldStart = this.#options.onStart?.(e, createDraggableData(this.#state, coreData))
    if (shouldStart === false)
      return false

    this.setState({ dragging: true, dragged: true })
  }

  onDrag: DraggableEventHandler = (e, coreData) => {
    if (!this.#state.dragging)
      return false

    const uiData = createDraggableData(this.#state, coreData)

    const newState = {
      x: uiData.x,
      y: uiData.y,
      slackX: 0,
      slackY: 0,
    }

    if (this.#state.bounds) {
      // Save original x and y.
      const { x, y } = newState

      // Add slack to the values used to calculate bound position. This will ensure that if
      // we start removing slack, the element won't react to it right away until it's been
      // completely removed.
      newState.x += this.#state.slackX
      newState.y += this.#state.slackY

      // Get bound position. This will ceil/floor the x and y within the boundaries.
      const [newStateX, newStateY] = getBoundPosition(this.#state, newState.x, newState.y)
      newState.x = newStateX
      newState.y = newStateY

      // Recalculate slack by noting how much was shaved by the boundPosition handler.
      newState.slackX = this.#state.slackX + (x - newState.x)
      newState.slackY = this.#state.slackY + (y - newState.y)

      // Update the event we fire to reflect what really happened after bounds took effect.
      uiData.x = newState.x
      uiData.y = newState.y
      uiData.deltaX = newState.x - this.#state.x
      uiData.deltaY = newState.y - this.#state.y
    }

    const shouldUpdate = this.#options.onDrag?.(e, uiData)
    if (shouldUpdate === false)
      return false

    this.setState(newState)
  }

  onDragStop: DraggableEventHandler = (e, coreData) => {
    if (!this.#state.dragging)
      return false

    const shouldUpdate = this.#options.onStop?.(e, coreData)
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
}
