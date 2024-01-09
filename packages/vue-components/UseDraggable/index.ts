import type { DraggableOptions } from '@fe-hub/core'
import type { RenderableComponent } from '@fe-hub/vue-components/type'
import { useDraggable } from '@fe-hub/vue-composables'
import { cloneVNode, defineComponent, h, mergeProps, ref } from 'vue'

export interface UseDraggableProps extends DraggableOptions, RenderableComponent {}

export const UseDraggable = /* #__PURE__ */ defineComponent<UseDraggableProps>({
  name: 'UseDraggable',
  setup(props, { slots }) {
    const el = ref<HTMLElement | null>(null)

    const { style } = useDraggable(el, props)

    return () => {
      if (slots.default) {
        const _slots = slots.default({ customData: 2 }).filter(item => item.type !== Comment)

        const extraProps = {
          ref: el,
          style: 'touch-action:none;',

        }

        // 合并两个style
        const merged = mergeProps(extraProps, { style: style.value })

        const isSingle = _slots.length === 1
        if (isSingle)

          return cloneVNode(_slots[0], merged)

        return h(props.as || 'div', merged, _slots)
      }
    }
  },
})
