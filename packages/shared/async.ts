// 导出PromiseFn类型，它是一个函数，接受一个泛型T，返回一个Promise<R>
export type PromiseFn<T extends any[], R> = (...args: T) => Promise<R>

/**
 *  异步超时处理
 * @param ms 毫秒
 */
export function asyncTimeout(ms = 5000) {
  // 第一层接收超时时间
  return function <T extends any[], R>(fn: PromiseFn<T, R>) {
    // 第二层接收promise,定义promise的泛型
    return function (...args: T) {
      // 第三层接收参数
      return Promise.race([fn(...args), new Promise<never>((_, reject) => setTimeout(() => {
        reject(new Error('Timeout'))
      }, ms))])
    }
  }
}

/**
 * 错误重试
 * @param maxRetries 重试次数，默认三次
 * @param delay 每次重试的事件间隔（毫秒），默认立即执行
 */
export function withRetry(maxRetries = 3, delay = 0) {
  return function <T extends any[], R>(fn: PromiseFn<T, R>) {
    return async function (...args: T) {
      /**
       * 这段代码妙在利用了while不断执行
       * 通过抛异常结束
       */
      let retries = 0
      while (true) {
        try {
          retries && delay && await sleep(delay)
          return await fn(...args)
        }
        catch (e) {
          if (retries === maxRetries)
            throw e
          console.warn(`Retry ${retries} times due to error: `, e)
          retries++
        }
      }
    }
  }
}

export function sleep(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
