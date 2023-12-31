export function addEvent(el: HTMLElement | Document, event: string, handler: EventListener, options?: boolean | AddEventListenerOptions) {
  el.addEventListener(event, handler, options)
}

export function removeEvent(el: HTMLElement | Document, event: string, handler: EventListener) {
  el.removeEventListener(event, handler)
}

// eslint-disable-next-line no-restricted-syntax
export const enum MouseEventButtonEnum {
  /**
   * 主按键被按下（通常为左键）或未初始化
   */
  LEFT = 0,
  /**
   * 辅助按键被按下 (通常为中键)
   */
  MIDDLE = 1,
  /**
   * 次按键被按下 (通常为右键)
   */
  RIGHT = 2,

}
