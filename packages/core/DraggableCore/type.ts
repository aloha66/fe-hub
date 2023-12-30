import type { Position } from '@fe-hub/shared'

export type ControlPosition = Position

export type DraggableData = {
  deltaX: number
  deltaY: number
  lastX: number
  lastY: number
} & ControlPosition

export type DraggableEventHandler = (e: Event, data: DraggableData) => void | false
