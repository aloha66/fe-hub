import type { SetStateAction } from 'react'
import { useCallback, useRef, useState } from 'react'

interface Options {
  /**
   * 立即执行
   */
  immediate: boolean
}

export function useDelayState<T>(initState: T | (() => T), dealy = 3000) {
  const [state, setState] = useState<T>(initState)

  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const handleDelay = useCallback((payload: SetStateAction<T>, options: Options = { immediate: false }) => {
    clearTimeout(timerRef.current)

    const { immediate } = options
    if (immediate) {
      setState(payload)
      return
    }

    setTimeout(() => {
      setState(payload)
    }, dealy)
  }, [])

  return [state, handleDelay] as const
}
