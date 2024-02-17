import type { DraggableOptions } from '@fe-hub/core'
import { removeUndefined } from '@fe-hub/shared'
import type { RenderableComponent } from '@fe-hub/vue-components/type'
import { useCountDown } from '@fe-hub/vue-composables'
import { cloneVNode, defineComponent, h, mergeProps, ref, watch } from 'vue'

export interface UseDraggableProps extends DraggableOptions, RenderableComponent {
}

export const UseCountDown = /* #__PURE__ */ defineComponent<UseDraggableProps>({
  name: 'UseCountDown',
  props: [
    'relativeTime',
    'abslouteTime',
    'aliasTime',
    'offset',
    'isIncrement',
    'manual',
    'millisecond',
    'onEnd',
    'as',
    'onChange',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const data = useCountDown({ ...props, controls: true })
    // watch(props, (newProps) => {
    //   setState({ ...removeUndefined(newProps) })
    // })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
    // return () => {
    //   if (slots.default) {
    //     const _slots = slots.default({ customData: 2 }).filter(item => item.type !== Comment)

    //     const extraProps = {
    //       ref: el,
    //       style: 'touch-action:none;',

    //     }

    //     // 合并两个style
    //     const merged = mergeProps(extraProps, { style: style.value })

    //     const isSingle = _slots.length === 1
    //     if (isSingle)

    //       return cloneVNode(_slots[0], merged)

    //     return h(props.as || 'div', merged, _slots)
    //   }
    // }
  },
})
