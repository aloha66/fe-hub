import { DraggableCore } from '@fe-tool/core'
import type { Ref } from 'vue'
import { onMounted, onUnmounted, watchEffect } from 'vue'

export function useDraggableCore(el: Ref<HTMLElement | null>) {
  const dc = new DraggableCore()

  onMounted(() => {
    dc.setElement(el.value)
  })

  onUnmounted(() => {
    // dc.destory()
  })
  watchEffect(() => {

  })

  return {

  }
}
