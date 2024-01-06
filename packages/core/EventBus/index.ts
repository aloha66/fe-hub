export type EventType = keyof any

export type Handler<T = unknown> = (payload: T) => void

export type EventHandlerList<T = unknown> = Array<Handler<T>>

export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
keyof Events | '*',
EventHandlerList<Events[keyof Events]>
>

export class EventBus {
  #map = new Map()

  on(type: EventType, handler: Handler) {
    const handlers = this.get(type)
    handlers ? handlers.push(handler) : this.#map.set(type, [handler])
  }

  get(type: EventType) {
    return this.#map.get(type)
  }
}
