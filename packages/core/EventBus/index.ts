export type EventType = keyof any

export type Handler<T = unknown> = (payload: T) => void

export type EventHandlerList<T = unknown> = Array<Handler<T>>

export class EventBus {
  #map = new Map<EventType, EventHandlerList>()

  /**
   * 存储once的数据
   */
  #onceMap = new Map<EventType, EventHandlerList>()

  on(type: EventType, handler: Handler) {
    const handlers = this.get(type)
    handlers ? handlers.push(handler) : this.#map.set(type, [handler])
  }

  get(type: EventType) {
    return this.#map.get(type)
  }

  getOnce(type: EventType) {
    return this.#onceMap.get(type)
  }

  off(type: EventType, handler?: Handler) {
    const has = this.#map.has(type)
    if (has) {
      const handlers = this.#map.get(type)
      if (handlers) {
        if (handler) {
          // 结果右移，转换为无符号整数
          // 当前目标不存在时，返回一个很大的数字
          handlers.splice(handlers.indexOf(handler) >>> 0, 1)
        }
        else {
          this.#map.set(type, [])
        }
      }
    }
  }

  emit(type: EventType, payload?: unknown) {
    const handlers = this.get(type)
    if (handlers)
      handlers.forEach(handler => handler(payload))

    const oneHandlers = this.getOnce(type)
    if (oneHandlers) {
      oneHandlers.forEach(handler => handler(payload))
      this.#onceMap.delete(type)
    }
  }

  once(type: EventType, handler: Handler) {
    const handlers = this.#onceMap.get(type)
    handlers ? handlers.push(handler) : this.#onceMap.set(type, [handler])
  }

  offOnce(type: EventType) {
    const has = this.#onceMap.has(type)
    if (has)
      this.#onceMap.delete(type)
  }
}
