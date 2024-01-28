import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDelayState } from '.'

describe('useDelayState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })
  it('should delay change state', () => {
    const { result } = renderHook(() => useDelayState(1))
    act(() => {
      const [state, setState] = result.current
      expect(state).toBe(1)
      setState(2)
      // vi.runAllTimers()
      vi.advanceTimersToNextTimer()
    })
    expect(result.current[0]).toBe(2)
  })

  it('should delay change state by function', () => {
    const { result } = renderHook(() => useDelayState(1))
    act(() => {
      const [state, setState] = result.current
      expect(state).toBe(1)
      setState(prev => 2 + prev)
      // vi.runAllTimers()
      vi.advanceTimersToNextTimer()
    })
    expect(result.current[0]).toBe(3)
  })

  it('should change state immediate', () => {
    const { result } = renderHook(() => useDelayState(1))
    act(() => {
      const [state, setState] = result.current
      expect(state).toBe(1)
      setState(2, { immediate: true })
    })
    expect(result.current[0]).toBe(2)
  })
})
