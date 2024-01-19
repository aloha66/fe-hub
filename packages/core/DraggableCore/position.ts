import { getTouch, int, isNumber, offsetXYFromParent } from '@fe-hub/shared'
import type { FinalState } from '../Draggable/Draggable'
import type { Bounds } from '..'
import type { DraggableData } from './type'
import type { DraggableCoreState } from '.'

export function getControlPosition(e: TouchEvent, options: DraggableCoreState, node: HTMLElement, touchIdentifier?: number) {
  const touchObj = typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null
  if (typeof touchIdentifier === 'number' && !touchObj)
    return null // 不是正确的点

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

export function canDragX({ axis }: FinalState) {
  return axis === 'x' || axis === 'both'
}

export function canDragY({ axis }: FinalState) {
  return axis === 'y' || axis === 'both'
}

export function createDraggableData(draggable: FinalState, coreData: DraggableData): DraggableData {
  const { x, y } = draggable
  const scale = draggable.scale!
  const deltaX = (coreData.deltaX / scale)
  const deltaY = (coreData.deltaY / scale)

  return {
    x: x + deltaX,
    y: y + deltaY,
    deltaX,
    deltaY,
    lastX: x,
    lastY: y,
  }
}

function getComputedStyle(node: HTMLElement) {
  const { defaultView } = node.ownerDocument
  if (!defaultView)
    throw new Error('defaultView is null')

  return defaultView.getComputedStyle(node)
}

function innerWidth(node: HTMLElement): number {
  let width = node.clientWidth
  const computedStyle = getComputedStyle(node)
  width -= int(computedStyle.paddingLeft)
  width -= int(computedStyle.paddingRight)
  return width
}

function innerHeight(node: HTMLElement): number {
  let height = node.clientHeight
  const computedStyle = getComputedStyle(node)
  height -= int(computedStyle.paddingTop)
  height -= int(computedStyle.paddingBottom)
  return height
}

function outerHeight(node: HTMLElement): number {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  let height = node.clientHeight
  const computedStyle = getComputedStyle(node)
  height += int(computedStyle.borderTopWidth)
  height += int(computedStyle.borderBottomWidth)
  return height
}

function outerWidth(node: HTMLElement): number {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetLeft which is including margin. See getBoundPosition
  let width = node.clientWidth
  const computedStyle = getComputedStyle(node)
  width += int(computedStyle.borderLeftWidth)
  width += int(computedStyle.borderRightWidth)
  return width
}

function getBoundPositionByString(node: HTMLElement, bounds: string) {
  const { ownerDocument } = node
  const ownerWindow = ownerDocument.defaultView!
  const boundNode = bounds === 'parent' ? node.parentNode : ownerDocument.querySelector(bounds)

  if (!(boundNode instanceof ownerWindow.HTMLElement))
    throw new Error(`Bounds selector "${bounds}" could not find an element.`)

  const nodeStyle = ownerWindow.getComputedStyle(node)
  const boundNodeStyle = ownerWindow.getComputedStyle(boundNode)
  // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.

  return {
    left: -node.offsetLeft + int(boundNodeStyle.paddingLeft) + int(nodeStyle.marginLeft),
    top: -node.offsetTop + int(boundNodeStyle.paddingTop) + int(nodeStyle.marginTop),
    right: innerWidth(boundNode) - outerWidth(node) - node.offsetLeft
    + int(boundNodeStyle.paddingRight) - int(nodeStyle.marginRight),
    bottom: innerHeight(boundNode) - outerHeight(node) - node.offsetTop
    + int(boundNodeStyle.paddingBottom) - int(nodeStyle.marginBottom),

  }
}

/**
 * 计算元素在边界内的位置
 * @param draggable
 * @param x
 * @param y
 * @returns
 */

export function getBoundPosition(draggable: FinalState, x: number, y: number, node: HTMLElement): [number, number] {
  const { bounds } = draggable
  if (!bounds)
    return [x, y]
  const isString = typeof bounds === 'string'
  let _bounds = cloneBounds(bounds as Bounds)

  let _x = x
  let _y = y
  if (isString)
    _bounds = getBoundPositionByString(node, bounds)

  // Keep x and y below right and bottom limits...
  if (isNumber(_bounds.right))
    _x = Math.min(_x, _bounds.right)
  if (isNumber(_bounds.bottom))
    _y = Math.min(_y, _bounds.bottom)

  if (isNumber(_bounds.left))
    _x = Math.max(_x, _bounds.left)
  if (isNumber(_bounds.top))
    _y = Math.max(_y, _bounds.top)
  return [_x, _y]
}

// A lot faster than stringify/parse
function cloneBounds(bounds: Bounds): Bounds {
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
  }
}
