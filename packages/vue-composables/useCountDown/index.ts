import type { CountDownOptions, CountDownState } from '@fe-hub/core'
import { CountDown } from '@fe-hub/core'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

interface Pausable {
  start: () => void
  pause: () => void
  stop: (targetTime?: number) => void
}

export interface useCountDownProps<Controls extends boolean> extends CountDownOptions {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
}

type Current = ComputedRef<{
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}>

interface Return {
  count: Ref<number>
  current: Current
  setState: (payload: CountDownState) => void
}

export function useCountDown(options?: useCountDownProps<false>): Current
export function useCountDown(options: useCountDownProps<true>): Return & Pausable
export function useCountDown(options: useCountDownProps<boolean> = {}) {
  const { controls = false, ...rest } = options
  const count = ref<number>(0)
  const cd = new CountDown({ ...rest, onChange(e: number) {
    count.value = e
  } })

  const current = computed(() => cd.parseFormat(count.value))

  if (controls) {
    return {
      count,
      current,
      start: cd.start,
      pause: cd.pause,
      stop: cd.stop,
      setState: cd.setState.bind(cd),
    }
  }

  return current
}
