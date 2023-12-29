import { getTouch, offsetXYFromParent } from '@fe-hub/shared'
import type { DraggableCoreOptions } from '.'

export function getControlPosition(e: TouchEvent, options: DraggableCoreOptions, touchIdentifier?: number) {
  const touchObj = typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null
  if (typeof touchIdentifier === 'number' && !touchObj)
    return null // 不是正确的点

  const node = e.target as HTMLElement

  const offsetParent = options.offsetParent || node?.offsetParent as HTMLElement || node.ownerDocument.body

  return offsetXYFromParent(touchObj || e as unknown as MouseEvent, offsetParent, options.scale!)
}

export function createCoreData(lastX: number, lastY: number, x: number, y: number) {
  const isStart = Number.isNaN(lastX)

  if (isStart) {
    return {
      deltaX: 0,
      deltaY: 0,
      lastX: x,
      lastY: y,
      x,
      y,
    }
  }

  return {
    deltaX: x - lastX,
    deltaY: y - lastY,
    lastX,
    lastY,
    x,
    y,
  }
}

export function snapToGrid(grid: [number, number], pendingX: number, pendingY: number) {
  const [gridX, gridY] = grid
  // Math.round(pendingX / gridX) 获取基于grid的移动整数倍
  const x = Math.round(pendingX / gridX) * gridX // 再*gridX 得出基于grid的移动距离
  const y = Math.round(pendingY / gridY) * gridY
  return [x, y]
}
