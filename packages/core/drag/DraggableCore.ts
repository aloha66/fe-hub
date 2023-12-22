function noop() { }

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

export interface DraggableCoreOptions extends DraggableCoreState {}

export class DraggableCore {
  #options: DraggableCoreOptions

  #state: DraggableCoreState

  get state() {
    return this.#state
  }

  /**
   * 是否挂载
   */
  mounted = false

  #el: HTMLElement

  setState(payload: Partial<DraggableCoreState>) {
    this.#state = { ...this.#state, ...payload }
  }

  constructor(options: DraggableCoreOptions = {}) {
    this.#options = options
    console.log(1)
    const { disabled = false, allowAnyClick = false, handle = '', cancel = '' } = options

    this.#state = {
      disabled,
      allowAnyClick,
      handle,
      cancel,
    }
  }

  setElement(el: HTMLElement | null) {
    if (!el)
      throw new Error('el is null')

    this.#el = el
    this.mounted = true
  }
}
