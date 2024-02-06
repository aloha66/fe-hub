import type { CountDownOptions } from '@fe-hub/core'
import { CountDown } from '@fe-hub/core'
import { ref } from 'vue'

export interface useCountDownProps extends CountDownOptions {}

export function useCountDown(options?: useCountDownProps) {
  const count = ref<number>(0)
  const cd = new CountDown({ ...options, onChange(e: number) {
    console.log(e)
    count.value = e
  } })

  // return count
  return {
    count,
    start: cd.start,
    pause: cd.pause,
    stop: cd.stop,
  }
}
