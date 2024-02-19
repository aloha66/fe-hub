import { CountDown, type CountDownOptions, type CountDownState } from '@fe-hub/core'
import { useEffect, useState } from 'react'
import { useOnce } from '../useOnce'

// TODO 合并
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

// TODO 整合到
interface Current {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

interface Return {
  count: number
  current: Current
  setState: (payload: CountDownState) => void
}

export function useCountDown(options?: useCountDownProps<false>): Current
export function useCountDown(options: useCountDownProps<true>): Return & Pausable
export function useCountDown(options: useCountDownProps<boolean> = {}) {
  const [count, setCount] = useState<number>(0)
  const { controls = false, ...rest } = options

  const cd = useOnce(() => new CountDown({ ...rest, onChange(e: number) {
    setCount(e)
  } }))!

  const { isIncrement, manual, millisecond } = rest

  // 动态变化未必是好事
  useEffect(() => {
    cd.setState({ isIncrement, manual, millisecond })
  }, [isIncrement, manual, millisecond])

  const current = cd.parseFormat(count)

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
