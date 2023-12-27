export function addEvent(el: HTMLElement, event: string, handler: EventListener) {
  el.addEventListener(event, handler)
}

export function removeEvent(el: HTMLElement, event: string, handler: EventListener) {
  el.removeEventListener(event, handler)
}
