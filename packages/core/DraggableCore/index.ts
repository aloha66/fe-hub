import { addEvent, removeEvent } from '@fe-hub/shared'
import type { DraggableEventHandler } from './type'

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

  #state: DraggableCoreState = {
    scale: 1,
  }

  get state() {
    return this.#state
  }

  /**
   * 是否挂载
   */
  mounted = false

  #el: HTMLElement | null = null

  setState(payload: Partial<DraggableCoreState>) {
    this.#state = { ...this.#state, ...payload }
  }

  constructor(options: DraggableCoreOptions = {}) {
    const { onMouseDown, onStart, onDrag, onStop } = options
    this.#options = options
    this.#options.onMouseDown = onMouseDown || noop
    this.#options.onStart = onStart || noop
    this.#options.onDrag = onDrag || noop
    this.#options.onStop = onStop || noop

    const { disabled = false, allowAnyClick = false, handle = '', cancel = '' } = options

    this.#state = {
      disabled,
      allowAnyClick,
      handle,
      cancel,
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
      addEvent(this.#el!, eventsFor.point.start, this.handleDragStart)
      addEvent(this.#el!, eventsFor.point.stop, this.handleDragStop)
      return
    }

    addEvent(this.#el!, eventsFor.touch.start, this.handleDragStart)
    addEvent(this.#el!, eventsFor.touch.stop, this.handleDragStop)
    addEvent(this.#el!, eventsFor.mouse.start, this.handleDragStart)
    addEvent(this.#el!, eventsFor.mouse.stop, this.handleDragStop)
  }

  #unRegisterEvent() {
    if (this.#options.enablePointEvent) {
      removeEvent(this.#el!, eventsFor.point.start, this.handleDragStart)
      removeEvent(this.#el!, eventsFor.point.stop, this.handleDragStop)
      return
    }
    removeEvent(this.#el!, eventsFor.touch.start, this.handleDragStart)
    removeEvent(this.#el!, eventsFor.touch.stop, this.handleDragStop)
    removeEvent(this.#el!, eventsFor.mouse.start, this.handleDragStart)
    removeEvent(this.#el!, eventsFor.mouse.stop, this.handleDragStop)
  }

  handleDragStart() {}

  handleDrag() {}

  handleDragStop() {}

  onMouseDown(e: Event) {
    dragEventFor = eventsFor.mouse // on touchscreen laptops we could switch back to mouse

    return this.handleDragStart(e)
  }

  onMouseUp(e: Event) {
    dragEventFor = eventsFor.mouse

    return this.handleDragStop(e)
  }

  onPointerDown(e: Event) {
    dragEventFor = eventsFor.point

    return this.handleDragStart(e)
  }

  onPointerUp(e: Event) {
    dragEventFor = eventsFor.point

    return this.handleDragStop(e)
  }

  /**
   * 元素直接调用
   * @param e Event
   */
  // Same as onMouseDown (start drag), but now consider this a touch device.
  onTouchStart(e: Event) {
    // We're on a touch device now, so change the event handlers
    dragEventFor = eventsFor.touch

    return this.handleDragStart(e)
  }

  onTouchEnd(e: Event) {
    // We're on a touch device now, so change the event handlers
    dragEventFor = eventsFor.touch

    return this.handleDragStop(e)
  }
}
