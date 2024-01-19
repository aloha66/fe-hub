/**
 * 检查一个元素或其任何父元素是否匹配给定的 CSS 选择器
 * @param el 待检查的元素
 * @param selector 选择器
 * @param baseNode 基础节点,作为终止条件
 * @returns
 */
export function matchesSelectorAndParentsTo(el: Node, selector: string, baseNode: Node): boolean {
  let node: Node | null = el

  while (node) {
    // @ts-expect-error let me do it
    if (node.matches(selector))
      return true // 元素具有指定选择器返回true
    if (node === baseNode)
      return false // 找不到
    node = node.parentNode
  }
  // do {
  //   if (matchesSelector(node, selector)) return true;
  //   if (node === baseNode) return false;
  //   // $FlowIgnore[incompatible-type]
  //   node = node.parentNode;
  // } while (node);

  return false
}

export function getTouchIdentifier(e: TouchEvent) {
  if (e.targetTouches && e.targetTouches[0])
    return e.targetTouches[0].identifier
  if (e.changedTouches && e.changedTouches[0])
    return e.changedTouches[0].identifier
}

export function getTouch(e: TouchEvent, touchIdentifier: number) {
  return (e.targetTouches && Array.from(e.targetTouches).find(touch => touch.identifier === touchIdentifier))
    || (e.changedTouches && Array.from(e.changedTouches).find(touch => touch.identifier === touchIdentifier))
}

export function offsetXYFromParent(evt: Touch | MouseEvent, offsetParent: HTMLElement, scale: number) {
  const isBody = offsetParent === offsetParent.ownerDocument.body
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect()

  const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale
  const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale

  return { x, y }
}

export interface Position {
  x: number
  y: number
}

export interface PositionOffsetControlPosition {
  x: number | string
  y: number | string
}

export function getTranslation({ x, y }: Position, unitSuffix: string, positionOffset?: PositionOffsetControlPosition) {
  let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`
  if (positionOffset) {
    const defaultX = `${(typeof positionOffset.x === 'string') ? positionOffset.x : positionOffset.x + unitSuffix}`
    const defaultY = `${(typeof positionOffset.y === 'string') ? positionOffset.y : positionOffset.y + unitSuffix}`
    translation = `translate(${defaultX}, ${defaultY})${translation}`
  }
  return translation
}

export function createCSSTransform(controlPos: Position, positionOffset?: PositionOffsetControlPosition) {
  const translation = getTranslation(controlPos, 'px', positionOffset)
  // TODO 可能要兼容浏览器
  return {
    transform: translation,
    // WebkitTransform: translation,
    // MozTransform: translation,
    // msTransform: translation,
    // OTransform: translation
  }
}
