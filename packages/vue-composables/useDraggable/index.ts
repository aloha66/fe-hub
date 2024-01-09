import type { StateChangeOptions } from '@fe-hub/core'
import { Draggable } from '@fe-hub/core'
import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'

export function useDraggable(el: Ref<HTMLElement | null>) {
  const da = new Draggable()

  const style = ref({})

  onMounted(() => {
    da.setElement(el.value)

    da.onStateChange(({ newStyle }: StateChangeOptions) => {
      style.value = newStyle
    })
  })

  onUnmounted(() => {
    da.destory()
  })
  watchEffect(() => {

  })

  return {
    style,
  }
}
