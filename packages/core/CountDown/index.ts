import { fixDateFormatForSafari, isNumber, isString } from '@fe-hub/shared'
import { DAY, HOUR, MINUTE, SECOND } from '@fe-hub/shared/constant'

type TDate = Date | number | string | undefined

function getNumAndUnit(time: string) {
  const regex = /(\d+)([a-zA-Z])/
  const [_, num, unit] = time.match(regex)!
  return [+num, unit] as const
}

function transformTargetDate(date: TDate, dateNow: number) {
  if (!date)
    return dateNow
  if (isNumber(date))
    return date
  if (isString(date))
    return +new Date(date)
  return date.getTime()
}

export interface CountDownState {
  /**
   * 剩余时间（毫秒）
   */
  leftTime?: number
  /**
   * 目标时间
   */
  targetDate?: TDate
  /**
   * 快速提供时间，数字是时间数值，字母是时间单位
   * 只能是以下几种类型
   * 1s 表示1秒
   * 1m 表示1分钟
   * 1h 表示1小时
   * 1d 表示1天
   * 1M 表示1个月
   * 1y 表示1年
   */
  aliasTime?: string
  /**
   * 时间间隔
   * 字符串可以是aliasTime的值
   */
  offset?: number | string
  /**
   * 时间间隔是否递增
   * @default false
   */
  isIncrement?: boolean
  /**
   * 手动执行
   * @default false
   */
  manual?: boolean

}

export interface CountDownOptions extends CountDownState {
  /**
   * 倒计时结束触发
   */
  onEnd?: () => void
  onCountChange?: (time: number) => void
}

export class CountDown {
  #state: CountDownState
  #option: CountDownOptions

  // @ts-expect-error let me do it
  #timer: ReturnType<typeof setInterval>

  #count = 0

  #dateNow = Date.now()

  #pauseTime = 0

  constructor(options: CountDownOptions = {}) {
    this.#option = options
    const { onEnd: _onEnd, leftTime, targetDate, aliasTime, manual = false, ...rest } = options
    if (!isNumber(leftTime) && !targetDate && !aliasTime)
      throw new Error('time is undefined')
    this.#state = { leftTime, targetDate: this.#fixDateByString(targetDate), aliasTime, manual, ...rest }

    !manual && this.run()
  }

  setState(payload: CountDownState) {
    this.#state = { ...this.#state, ...payload }
  }

  /**
   * 目标时间
   */
  get target() {
    const { leftTime, aliasTime, targetDate } = this.#state
    if (isNumber(leftTime) && leftTime > 0)
      return this.#dateNow + leftTime
    else if (aliasTime)
      return this.#dateNow + this.#calcAliasTime(aliasTime)

    return transformTargetDate(targetDate, this.#dateNow)
  }

  get offset() {
    const { offset } = this.#state
    if (!offset)
      return SECOND
    if (isNumber(offset))
      return offset
    return this.#calcAliasTime(offset)
  }

  get count() {
    return this.#count
  }

  run = () => {
    this.#dateNow = Date.now()
    const { isIncrement } = this.#state
    if (isIncrement && !this.#pauseTime)
      this.#count = 0
    this.#IntervalRun()
  }

  pause = () => {
    this.#pauseTime = this.#count
    this.#IntervalPause()
  }

  stop = () => {
    this.#pauseTime = 0
    this.#count = 0
    this.#IntervalStop()
  }

  #fixDateByString(date: TDate) {
    if (typeof date !== 'string')
      return date
    return fixDateFormatForSafari(date)
  }

  #calcAliasTime(aliasTime: string): number {
    const [num, unit] = getNumAndUnit(aliasTime)
    if (num === 0)
      return num

    const calcMap = {
      s: () => SECOND * num,
      m: () => MINUTE * num,
      h: () => HOUR * num,
      d: () => DAY * num,
      /**
       * 月，年需要单独用函数
       * 得到的结果是绝对时间
       * 为了统一写法 这里先减去当前时间得到相对时间
       */
      M: () => {
        const date = new Date()
        let month = date.getMonth()
        month += num
        date.setMonth(month)
        return +date - Date.now()
      },
      y: () => {
        const date = new Date()
        let year = date.getFullYear()
        year += num
        date.setFullYear(year)
        return +date - Date.now()
      },
    }

    return Reflect.get(calcMap, unit)()
  }

  #decrement() {
    if (!this.target)
      return 0

    const remainingTime = this.#pauseTime ? this.#pauseTime : this.target - Date.now()
    if (this.#pauseTime > 0)
      this.#pauseTime -= this.offset

    this.#count = Math.max(remainingTime, 0)
    if (this.#count === 0) {
      this.#IntervalStop()
      this.#option.onEnd?.()
    }
  }

  #increment() {
    this.#count += this.offset
    if (this.#count >= this.target - this.#dateNow) {
      this.#IntervalStop()
      this.#option.onEnd?.()
    }
  }

  #IntervalRun() {
    clearInterval(this.#timer)
    this.#timer = setInterval(() => {
      const { isIncrement } = this.#state
      isIncrement ? this.#increment() : this.#decrement()
      this.#option.onCountChange?.(this.#count)
    }, this.offset)
  }

  #IntervalPause() {
    clearInterval(this.#timer)
  }

  #IntervalStop() {
    clearInterval(this.#timer)
  }
}
