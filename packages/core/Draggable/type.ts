import type { PositionOffsetControlPosition } from '@fe-hub/shared'
import type { DraggableCoreState } from '../DraggableCore'
import type { ControlPosition } from '../DraggableCore/type'

export interface DraggableState extends DraggableCoreState {
  /**
   * 决定往那个方向移动
   * 'both' 水平和垂直（默认）
   * 'x' 水平
   * 'y' 垂直
   * 'none' 不移动
   */
  axis?: 'both' | 'x' | 'y' | 'none'
  /**
   * 移动边界，限制移动范围
   * 'parent' 限制在节点的offsetParent内移动
   * 包含该元素的定位元素或者最近的 table, td, th, body 元素
   * [selector] 可以是一个选择器
   * {left,top,bottom,right}可以是这样的一个对象
   */

  bounds?: Bounds | string | false
  defaultClassName?: string
  defaultClassNameDragging?: string
  defaultClassNameDragged?: string
  /**
   * 默认的起始位置
   * 通常可以用css的absolute or relative代替
   */
  defaultPosition?: ControlPosition
  /**
   * 开始时的位置偏移
   */
  positionOffset?: PositionOffsetControlPosition
  /**
   * 提供了就是受控
   */
  position?: ControlPosition
}

export interface Bounds { left?: number, top?: number, right?: number, bottom?: number }
