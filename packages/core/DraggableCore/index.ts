import { MouseEventButtonEnum, addEvent, getTouchIdentifier, matchesSelectorAndParentsTo, removeEvent } from '@fe-hub/shared'
import type { DraggableEventHandler } from './type'
import { createCoreData, getControlPosition, snapToGrid } from './position'

function noop() { }

// 拖动事件的抽象名
const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
  point: {
    start: 'pointerdown',
    move: 'pointermove',
    stop: 'pointerup',
  },
}

// 每个实例都共享 所以不是成员变量
let dragEventFor = eventsFor.point

export interface DraggableCoreState {
  /**
   * 允许拖动非左键单击
   */
  allowAnyClick?: boolean
  /**
   * 禁止移动
   */
  disabled?: boolean

  /**
   * 选择器,只有选择器内的元素可以拖动
   */
  handle?: string
  /**
   * 选择器,只有选择器内的元素不可以拖动
   */
  cancel?: string
  /**
   * 指向最近的包含该元素的定位元素或者最近的 table, td, th, body 元素
   * 相对这个元素获取x,y
   */
  offsetParent?: HTMLElement
  /**
   * 元素经缩放的scale
   */
  scale?: number
  /**
   * 限定移动距离,制造网格
   */
  grid?: [number, number]
}

export interface DraggableCoreOptions extends DraggableCoreState {
  onMouseDown?(e: Event): void
  onStart?: DraggableEventHandler
  onDrag?: DraggableEventHandler
  onStop?: DraggableEventHandler
  /**
   * 开启PointEvent后，将取消监听touch和mouse事件（防止事件重复响应）
   */
  enablePointEvent?: boolean
}

export class DraggableCore {
  #options: DraggableCoreOptions

  #state: DraggableCoreState = {}
  get state() {
    return this.#state
  }

  /**
   * 是否挂载
   */
  mounted = false

  touchIdentifier?: number

  lastX: number = Number.NaN
  lastY: number = Number.NaN

  dragging = false

  #el: HTMLElement | null = null

  setState(payload: Partial<DraggableCoreState>) {
    this.#state = { ...this.#state, ...payload }
  }

  setEvent(eventName: string, event: Function) {
    Reflect.set(this.#options, eventName, event)
  }

  constructor(options: DraggableCoreOptions = {}) {
    const { onMouseDown, onStart, onDrag, onStop } = options
    this.#options = options
    this.#options.onMouseDown = onMouseDown || noop
    this.#options.onStart = onStart || noop
    this.#options.onDrag = onDrag || noop
    this.#options.onStop = onStop || noop
    this.initState(options)
  }

  initState(options: DraggableCoreOptions) {
    const { disabled = false, allowAnyClick = false, handle = '', cancel = '', offsetParent, scale = 1 } = options
    this.#options.scale = scale

    this.#state = {
      disabled,
      allowAnyClick,
      handle,
      cancel,
      scale,
      offsetParent,
    }
  }

  setElement(el: HTMLElement | null) {
    if (this.#el)
      return false
    if (!el)
      throw new Error('el is null')

    this.#el = el
    this.mounted = true

    this.#registerEvent()
  }

  destroy() {
    this.mounted = false
    this.#unRegisterEvent()
  }

  #registerEvent() {
    if (this.#options.enablePointEvent) {
      addEvent(this.#el!, eventsFor.point.start, this.onPointerDown)
      addEvent(this.#el!, eventsFor.point.stop, this.onPointerUp)
      return
    }

    addEvent(this.#el!, eventsFor.touch.start, this.onTouchStart, { passive: false })
    addEvent(this.#el!, eventsFor.touch.stop, this.onTouchEnd)
    addEvent(this.#el!, eventsFor.mouse.start, this.onMouseDown)
    addEvent(this.#el!, eventsFor.mouse.stop, this.onMouseUp)
  }

  #unRegisterEvent() {
    if (this.#options.enablePointEvent) {
      removeEvent(this.#el!, eventsFor.point.start, this.onPointerDown)
      removeEvent(this.#el!, eventsFor.point.stop, this.onPointerUp)
      return
    }

    removeEvent(this.#el!, eventsFor.touch.start, this.onTouchStart)
    removeEvent(this.#el!, eventsFor.touch.stop, this.onTouchEnd)
    removeEvent(this.#el!, eventsFor.mouse.start, this.onMouseDown)
    removeEvent(this.#el!, eventsFor.mouse.stop, this.onMouseUp)
  }

  #isBanToMove(ownerDocument: Document, e: TouchEvent) {
    // Short circuit if handle or cancel prop was provided and selector doesn't match.
    // 只有这些条件下不能被拖动
    // 1. 禁止拖动
    // 2. 存在handle且不属于handle的部分
    // 3. 存在cancel且属于cancel的部分
    if (this.#state.disabled
      || !((ownerDocument.defaultView && e.target instanceof ownerDocument.defaultView.Node))
      || (this.#state.handle && !matchesSelectorAndParentsTo(e.target, this.#state.handle, this.#el!))
      || (this.#state.cancel && matchesSelectorAndParentsTo(e.target, this.#state.cancel, this.#el!)))
      return false

    return true
  }

  #handleDragStart = (e: Event) => {
    const isMouseEvent = e.type === dragEventFor.start

    if (isMouseEvent) {
      const event = e as MouseEvent
      this.#options.onMouseDown!(event)

      if (!this.#state.allowAnyClick && typeof event.button === 'number' && event.button !== MouseEventButtonEnum.LEFT)
        return false
    }

    if (!this.#el)
      throw new Error('drag-element is not set')

    const { ownerDocument } = this.#el
    const event = e as TouchEvent

    if (!this.#isBanToMove(ownerDocument, event))
      return

    // Prevent scrolling on mobile devices, like ipad/iphone.
    // Important that this is after handle/cancel.
    if (e.type === 'touchstart')
      e.preventDefault()

    const touchIdentifier = getTouchIdentifier(event)
    this.touchIdentifier = touchIdentifier

    // 获取偏移量
    const position = getControlPosition(event, this.#state, touchIdentifier)
    if (position == null)
      return
    const { x, y } = position

    const shouldUpdate = this.#options.onStart?.(e, createCoreData(this.lastX, this.lastY, x, y))
    // 可显式取消
    if (shouldUpdate === false || !this.mounted)
      return

    this.dragging = true
    this.lastX = x
    this.lastY = y

    addEvent(ownerDocument, dragEventFor.move, this.#handleDrag)
    addEvent(ownerDocument, dragEventFor.stop, this.#handleDragStop)
  }

  #handleDragGrid(x: number, y: number) {
    const { grid } = this.#state

    if (Array.isArray(grid)) {
      if (grid.length !== 2)
        throw new Error('grid 长度必须等于2')

      let deltaX = x - this.lastX || 0 // 移动距离
      let deltaY = y - this.lastY || 0;

      [deltaX, deltaY] = snapToGrid(grid, deltaX, deltaY)
      if (!deltaX && !deltaY)
        return { x, y }
      return {
        x: this.lastX + deltaX,
        y: this.lastY + deltaY,
      }
    }
  }

  #handleDrag = (e: Event) => {
    const position = getControlPosition(e as TouchEvent, this.#state, this.touchIdentifier)
    if (position == null)
      return
    let { x, y } = position

    const grid = this.#handleDragGrid(x, y)
    if (grid) {
      x = grid.x
      y = grid.y
    }

    // console.log('this.lastX, this.lastY, x, y', this.lastX, this.lastY, x, y)

    // 可显式取消
    const shouldUpdate = this.#options.onDrag?.(e, createCoreData(this.lastX, this.lastY, x, y))
    if (shouldUpdate === false || this.mounted === false) {
      // 手动停止要补一个结束事件
      this.#handleDragStop(new TouchEvent('touchend'))
      return
    }

    // 更新坐标
    this.lastX = x
    this.lastY = y
  }

  #handleDragStop = (e: Event) => {
    if (!this.dragging)
      return

    const position = getControlPosition(e as TouchEvent, this.#state, this.touchIdentifier)
    if (position == null)
      return
    let { x, y } = position

    const grid = this.#handleDragGrid(x, y)
    if (grid) {
      x = grid.x
      y = grid.y
    }

    const shouldContinue = this.#options.onStop!(e, createCoreData(this.lastX, this.lastY, x, y))
    if (shouldContinue === false || this.mounted === false)
      return false

    // Reset the el.
    this.dragging = false
    this.lastX = Number.NaN
    this.lastY = Number.NaN

    const { ownerDocument } = this.#el!
    if (ownerDocument) {
      removeEvent(ownerDocument, dragEventFor.move, this.#handleDrag)
      removeEvent(ownerDocument, dragEventFor.stop, this.#handleDragStop)
    }
  }

  onMouseDown = (e: Event) => {
    dragEventFor = eventsFor.mouse // on touchscreen laptops we could switch back to mouse

    return this.#handleDragStart(e)
  }

  onMouseUp = (e: Event) => {
    dragEventFor = eventsFor.mouse

    return this.#handleDragStop(e)
  }

  onPointerDown = (e: Event) => {
    dragEventFor = eventsFor.point

    return this.#handleDragStart(e)
  }

  onPointerUp = (e: Event) => {
    dragEventFor = eventsFor.point

    return this.#handleDragStop(e)
  }

  /**
   * 元素直接调用
   * @param e Event
   */
  // Same as onMouseDown (start drag), but now consider this a touch device.
  onTouchStart = (e: Event) => {
    // We're on a touch device now, so change the event handlers
    dragEventFor = eventsFor.touch

    return this.#handleDragStart(e)
  }

  onTouchEnd = (e: Event) => {
    // We're on a touch device now, so change the event handlers
    dragEventFor = eventsFor.touch

    return this.#handleDragStop(e)
  }
}
