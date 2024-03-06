import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { asyncTimeout, withRetry } from './async'
import { FAILURE, SUCCESS } from './constant'

describe('asyncTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
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

describe('withRetry', () => {
  // beforeEach(() => {
  //   vi.useFakeTimers()
  // })
  // afterEach(() => {
  //   vi.restoreAllMocks()
  // })

  it('should resolve if the promise success at first try', async () => {
    // create a mock function that returns a resolved promise
    const mockFn = vi.fn().mockResolvedValue(SUCCESS)
    const result = await withRetry()(mockFn)()
    expect(result).toBe(SUCCESS)
    // check that the mock was called once
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should resolve if the promise success after some retries', async () => {
    // create a mock function that returns a rejected promise at first two tries
    // and a resolved promise at the third try
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error(FAILURE))
      .mockRejectedValueOnce(new Error(FAILURE))
      .mockResolvedValueOnce(SUCCESS)
    const condition = withRetry()
    const action = condition(mockFn)
    const result = await action()
    expect(result).toBe(SUCCESS)
    // check that the mock was called three times
    expect(mockFn).toHaveBeenCalledTimes(3)
  })

  /**
   * 时间的mock有问题
   */
  it.todo('should resolve if the promise success after some retries after 200ms', async () => {
    // create a mock function that returns a rejected promise at first two tries
    // and a resolved promise at the third try
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error(FAILURE))
      .mockRejectedValueOnce(new Error(FAILURE))
      .mockResolvedValueOnce(SUCCESS)
    const condition = withRetry(3, 200)
    const action = condition(mockFn)
    const result = action()
    // vi.advanceTimersToNextTimer()
    // vi.runAllTimers()
    expect(result).resolves.toBe(SUCCESS)
  })

  it('should reject if the promise fails after all retries', async () => {
    // create a mock function that returns a rejected promise always
    const mockFn = vi.fn().mockRejectedValue(new Error(FAILURE))
    const getDataWithRetry = withRetry()
    await expect(getDataWithRetry(mockFn)).rejects.toThrow(FAILURE)
    // check that the mock was called four times (initial + retries)
    expect(mockFn).toHaveBeenCalledTimes(4)
  })

  it('should reject if the promise fails after four retries', async () => {
    // create a mock function that returns a rejected promise always
    const mockFn = vi.fn().mockRejectedValue(new Error(FAILURE))
    const getDataWithRetry = withRetry(4)
    await expect(getDataWithRetry(mockFn)).rejects.toThrow(FAILURE)
    // check that the mock was called four times (initial + retries)
    expect(mockFn).toHaveBeenCalledTimes(5)
  })
})
