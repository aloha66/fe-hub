import { describe, expect, it } from 'vitest'
import { CountDown } from '.'

describe('countDown', () => {
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
