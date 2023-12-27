export interface ControlPosition { x: number, y: number }

export type DraggableData = {
  deltaX: number
  deltaY: number
  lastX: number
  lastY: number
} & ControlPosition

export type DraggableEventHandler = (e: Event, data: DraggableData) => void | false
