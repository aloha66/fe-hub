export type PromiseFn<T extends any[], R> = (...args: T) => Promise<R>

// 第一层接收超时时间
export function asyncTimeout(ms = 5000) {
  // 第二层接收promise,定义promise的泛型
  return function<T extends any[], R>(fn: PromiseFn<T, R>) {
    // 第三层接收参数
    return function (...args: T) {
      return Promise.race([fn(...args), new Promise<never>((_, reject) => setTimeout(() => {
        reject(new Error('Timeout'))
      }, ms))])
    }
  }
}

export function sleep(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
