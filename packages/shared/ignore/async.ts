/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */
import { asyncTimeout, sleep, withRetry } from '../async'

async function pending(ms = 200) {
  await sleep(ms)
  return 'success'
}

async function pendingReject(ms: number) {
  await sleep(ms)
  throw new Error('failure')
}

async function asyncTimeoutSuccess() {
  const condition = asyncTimeout(200)

  const action = condition(pending)

  const result = await action(12)

  console.log(result)
}

async function asyncTimeoutFailure() {
  const condition = asyncTimeout(200)

  const action = condition(() => pending(1000))

  const result = await action()
  console.log(result)
}
// asyncTimeoutSuccess()
// asyncTimeoutFailure()

async function withRetrySuccess() {
  const condition = withRetry(2)

  const action = condition(() => pending(2000))
  const result = await action()
  console.log(result)
}

let count = 0
async function failTwice() {
  if (count === 2) {
    count = 0
    return 'success'
  }

  count++
  return Promise.reject(new Error('failure'))
}

async function withRetryFailure(fn: any, times?: number) {
  const condition = withRetry(2, times)
  const action = condition(fn)
  const result = await action()
  console.log(result)
}

// withRetrySuccess()
// withRetryFailure(failTwice)
// withRetryFailure(failTwice,5000)
// console.log(1)
// console.time('second')
// setTimeout(() => {
//   console.timeEnd('second')
//   console.log(2)
// }, 3000);

// console.time('third')
// setTimeout(() => {
//   console.timeEnd('third')
//   console.log(3)
// }, 8000);
