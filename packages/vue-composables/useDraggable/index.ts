import type { DraggableOptions, DraggableState, StateChangeOptions } from '@fe-hub/core'
import { Draggable } from '@fe-hub/core'
import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

export function useDraggable(el: Ref<HTMLElement | null>, options: DraggableOptions = {}) {
  const da = new Draggable(options)

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

  function setState(newState: Partial<DraggableState>) {
    da.setState(newState)
  }

  return {
    style,
    setState,
  }
}
