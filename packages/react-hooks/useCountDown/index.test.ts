import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountDown } from '.'

describe('useCountDown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })
  it('should run normal', () => {
    const { result } = renderHook(() => useCountDown({ relativeTime: 1000 }))
    act(() => {
      const current = result.current
      expect(current).toHaveProperty('days')
      expect(current).toHaveProperty('hours')
      // // vi.runAllTimers()
      // vi.advanceTimersToNextTimer()
    })
    // expect(result.current[0]).toBe(2)
  })
})
