/* eslint-disable no-console */
import { asyncTimeout, sleep } from '../async'

async function pending(ms: number) {
  await sleep(ms)
  return 'success'
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

asyncTimeoutSuccess()
asyncTimeoutFailure()
