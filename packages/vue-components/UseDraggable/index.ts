import type { DraggableOptions } from '@fe-hub/core'
import { removeUndefind } from '@fe-hub/shared'
import type { RenderableComponent } from '@fe-hub/vue-components/type'
import { useDraggable } from '@fe-hub/vue-composables'
import { cloneVNode, defineComponent, h, mergeProps, ref, toValue, watch } from 'vue'

export interface UseDraggableProps extends DraggableOptions, RenderableComponent {}

export const UseDraggable = /* #__PURE__ */ defineComponent<UseDraggableProps>({
  name: 'UseDraggable',
  props: [
    'axis',
    'bounds',
    'defaultClassName',
    'defaultClassNameDragging',
    'defaultClassNameDragged',
    'defaultPosition',
    'positionOffset',
    'position',
    'as',
    'handle',
    'cancel',
    'allowAnyClick',
    'disabled',
    'offsetParent',
    'scale',
    'grid',
    'onStart',
    'onDrag',
    'onStop',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const el = ref<HTMLElement | null>(null)

    const { style, setState } = useDraggable(el, { ...props })

    // TODO props的变化时机
    /**
     * 也许不应该在这里处理（移动到composable里面？）
     * 放在这里的目的是不希望composable内部状态变更混乱
     * 放在外侧影响更少？
     * 或者说不应该用这种watch模式
     * 在vueuse他是通过computed对每一个可能发生变化的props进行处理
     * props是耦合对应的逻辑
     *
     * 我这里是需要收集每次改动的依赖透传给Core处理
     * 缺少了精准的字段更新机制和通知机制
     * 所以暂时只能统一处理，并过滤掉undefined的内容
     */
    watch(props, (newProps) => {
      setState({ ...removeUndefind(newProps) })
    })

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
