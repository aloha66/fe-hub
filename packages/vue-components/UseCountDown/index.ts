import type { CountDownOptions } from '@fe-hub/core'
import { removeUndefined } from '@fe-hub/shared'
import { useCountDown } from '@fe-hub/vue-composables'
import { defineComponent, reactive, watch } from 'vue'

export interface UseCountDownProps extends CountDownOptions {
}

export const UseCountDown = /* #__PURE__ */ defineComponent<UseCountDownProps>({
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
    // 没有reactive，解构的时候会丢失响应式
    const data = reactive(useCountDown({ ...props, controls: true }))

    watch(props, (newProps) => {
      data.setState({ ...removeUndefined(newProps) })
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
