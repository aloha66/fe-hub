import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CountDown } from '.'

describe('countDown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.clearAllTimers()
  })
  it('should starts immediately by default', async () => {
    const cd = new CountDown({ relativeTime: 200 })

    const initial = cd.count

    vi.advanceTimersByTime(1000)

    expect(initial).greaterThan(cd.count)
  })
  describe('manual', () => {
    it('should auto change count', () => {
      const onCountChange = (_e: number) => {}
      const mock = vi.fn(onCountChange)
      const cd = new CountDown({ relativeTime: 200, onChange: mock })
      vi.advanceTimersByTime(1000)
      expect(cd.count).toBe(0)
      expect(mock).toBeCalled()
    })

    it('should manual change count', () => {
      const onCountChange = (_e: number) => {}
      const mock = vi.fn(onCountChange)
      const cd = new CountDown({ relativeTime: 200, onChange: mock, manual: true })
      vi.advanceTimersByTime(1000)
      expect(cd.count).toBe(200)
      expect(mock).not.toBeCalled()
      cd.start()
      vi.advanceTimersByTime(1000)
      expect(cd.count).toBe(0)
      expect(mock).toBeCalled()
    })
  })

  describe('pause', () => {
    // 无法指定特定时间
    it.todo('should pause count when invoke pause', () => {
      const cd = new CountDown({ relativeTime: 200 })
      vi.advanceTimersByTime(60)
      cd.pause()
      expect(cd.count).lessThan(200)
      expect(cd.count).not.toBe(0)
      cd.start()
      vi.advanceTimersByTime(1000)
      expect(cd.count).toBe(0)
    })
  })

  describe('stop', () => {
    // 无法指定特定时间
    it.todo('should reset count when invoke stop', () => {
      const cd = new CountDown({ relativeTime: 200 })
      vi.advanceTimersByTime(60)
      cd.stop()
      expect(cd.count).toBe(200)
    })

    it.todo('should reset when invoke start after stop', () => {
      const cd = new CountDown({ relativeTime: 200 })
      vi.advanceTimersByTime(60)
      cd.stop()
      expect(cd.count).toBe(200)
      cd.start()
      vi.advanceTimersByTime(1000)
      expect(cd.count).toBe(0)
    })
  })

  it('should throw error when time is not defined', () => {
    expect(() => new CountDown()).toThrowError('time is undefined')
  })

  // 感觉不好写测试
  // 时间点都在变Date.now
  // describe('aliasTime', () => {
  //   it('should has target when relativeTime has value', () => {
  //     const cd = new CountDown({ relativeTime: 100 })

  //     expect(cd.target).not.toBeUndefined()
  //   })

  //   it('should has target when aliasTime has value', () => {
  //     const cd = new CountDown({ aliasTime: '100s' })
  //     expect(cd.target).not.toBeUndefined()
  //   })

  //   it('should has target when abslouteTime has value', () => {
  //     const cd = new CountDown({ abslouteTime: 100 })
  //     expect(cd.target).not.toBeUndefined()
  //   })
  // })
})
