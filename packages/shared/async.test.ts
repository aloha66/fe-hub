import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { asyncTimeout } from './async'

const SUCCESS = 'success'
const FAILURE = 'failure'

describe('asyncTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should resolve the original promise if it is faster than timeout', async () => {
    const condition = asyncTimeout(200)
    const promise = vi.fn().mockResolvedValue(SUCCESS) // 模拟异步操作的函数，返回一个成功的Promise

    const action = vi.fn(condition(promise))
    const result = await action(1, 2)
    expect(action).toBeCalledWith(1, 2)
    expect(result).toBe(SUCCESS)
    // 要移除await
    // expect(result).resolves.toBe(SUCCESS)
  })

  it('should reject the original promise if it is slower than timeout', async () => {
    const condition = asyncTimeout(5000)
    const promise = vi.fn().mockRejectedValue(FAILURE)

    const action = vi.fn(condition(promise))
    try {
      await action(1, 2)
    }
    catch (error) {
      expect(action).toBeCalledWith(1, 2)
      expect(action).rejects.toBe(FAILURE)
    }
  })
})
