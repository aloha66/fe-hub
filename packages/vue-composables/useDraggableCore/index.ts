import type { DraggableCoreOptions } from '@fe-hub/core'
import { DraggableCore } from '@fe-hub/core'
import type { Ref } from 'vue'
import { onMounted, onUnmounted, watchEffect } from 'vue'

export function useDraggableCore(el: Ref<HTMLElement | null>, options: DraggableCoreOptions) {
  const dc = new DraggableCore(options)

  onMounted(() => {
    dc.setElement(el.value)
  })

  onUnmounted(() => {
    dc.destroy()
  })
  watchEffect(() => {

  })

  return {}
}
