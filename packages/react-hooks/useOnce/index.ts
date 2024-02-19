import { useRef } from 'react'

export function useOnce<T>(fn: () => T) {
  const { current } = useRef<{ count: number, result: T | undefined }>({
    count: 0,
    result: undefined,
  })
  if (current.count > 0)
    return current.result

  current.count++

  current.result = fn()
  return current.result
}
