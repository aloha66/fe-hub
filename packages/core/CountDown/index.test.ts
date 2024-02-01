import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CountDown } from '.'

describe('countDown', () => {
  /**
   * TODO：
   * 全部测试的时候定时器没进去
   * 可能是其他测试的faketime影响了
   */
  describe('manual', () => {
    it.todo('should auto change count', () => {
      const onCountChange = (_e: number) => {}
      const mock = vi.fn(onCountChange)
      const cd = new CountDown({ leftTime: 200, onCountChange: mock })
      expect(cd.count).toBe(0)
      expect(mock).toBeCalled()
    })
  })

  it('should throw error when time is not defined', () => {
    expect(() => new CountDown()).toThrowError('time is undefined')
  })

  // 感觉不好写测试
  // 时间点都在变Date.now
  describe('aliasTime', () => {
    it('should has target when leftTime has value', () => {
      const cd = new CountDown({ leftTime: 100 })

      expect(cd.target).not.toBeUndefined()
    })

    it('should has target when aliasTime has value', () => {
      const cd = new CountDown({ aliasTime: '100s' })
      expect(cd.target).not.toBeUndefined()
    })

    it('should has target when targetDate has value', () => {
      const cd = new CountDown({ targetDate: 100 })
      expect(cd.target).not.toBeUndefined()
    })
  })
})
