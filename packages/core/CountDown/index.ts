import { DAY, HOUR, MINUTE, SECOND, fixDateFormatForSafari, isNumber, isString } from '@fe-hub/shared'
import { cancelRaf, raf } from '@fe-hub/shared/async'

type TDate = Date | number | string | undefined

function getNumAndUnit(time: string) {
  const regex = /(\d+)([a-zA-Z])/
  const [_, num, unit] = time.match(regex)!
  return [+num, unit] as const
}

function transformTargetDate(date: TDate) {
  if (!date)
    return Date.now()
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
   * 添加偏移值
   * 字符串可以是aliasTime的值
   * 如果是秒级运算 这是运算时间间隔
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
  /**
   * 毫秒级
   */
  millisecond?: boolean

}

export interface CountDownOptions extends CountDownState {
  /**
   * 倒计时结束触发
   */
  onEnd?: () => void
  onChange?: (time: number) => void
}

export class CountDown {
  #state: CountDownState
  #option: CountDownOptions

  #count = 0

  #counting = false
  #endTime = 0
  #startTime = 0

  #rafId = 0
  #timer: NodeJS.Timeout | 0 = 0

  constructor(options: CountDownOptions = {}) {
    this.#option = options
    const { onEnd: _onEnd, leftTime, targetDate, aliasTime, manual = false, isIncrement, ...rest } = options
    if (!isNumber(leftTime) && !targetDate && !aliasTime)
      throw new Error('time is undefined')
    this.#state = {
      leftTime,
      targetDate: this.#fixDateByString(targetDate),
      aliasTime,
      manual,
      isIncrement,
      // ...this.#handleOnTimeState(),
      ...rest,
    }

    this.setState({})

    this.#count = isIncrement ? 0 : this.targetTime

    !manual && this.start()
  }

  /**
   * 目标时间
   */
  get targetTime() {
    const { leftTime, aliasTime, targetDate } = this.#state
    if (isNumber(leftTime) && leftTime > 0)
      return leftTime
    else if (aliasTime)
      return this.#calcAliasTime(aliasTime)

    return transformTargetDate(targetDate)
  }

  get offset() {
    const { offset } = this.#state
    if (!offset)
      return 0
    if (isNumber(offset))
      return offset
    return this.#calcAliasTime(offset)
  }

  get count() {
    const { millisecond } = this.#state
    // 秒级运算方案已经存在误差
    // 而且是直接拿offset进行计时
    // 在这里就不再添加offfset的值
    const offset = millisecond ? this.offset : 0
    return this.#count + offset
  }

  setState(payload: CountDownState) {
    this.#state = { ...this.#state, ...this.#handleOnTimeState(), ...payload }
  }

  parseFormat = (count: number) => {
    return {
      days: Math.floor(count / DAY),
      hours: Math.floor(count / HOUR) % 24,
      minutes: Math.floor(count / MINUTE) % 60,
      seconds: Math.floor(count / SECOND) % 60,
      milliseconds: Math.floor(count) % SECOND,
    }
  }

  start = () => {
    if (this.#counting)
      return
    this.#counting = true
    this.#endTime = Date.now() + this.#count
    this.#startTime = this.#count ? Date.now() - this.#count : Date.now()
    this.#run()
  }

  pause = () => {
    this.#counting = false
    cancelRaf(this.#rafId)
  }

  stop = (targetTime = this.targetTime) => {
    this.pause()
    const { isIncrement } = this.#state
    this.#setCount(isIncrement ? 0 : targetTime)
  }

  #run() {
    const { millisecond } = this.#state
    millisecond ? this.#onTime() : this.#unOnTime()
  }

  #handleOnTimeState() {
    const { millisecond } = this.#state
    if (millisecond)
      return {}
    return {
      offset: this.offset ? this.offset : SECOND,
    }
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

  #setCount(value: number) {
    this.#count = value
    this.#option.onChange?.(value)
    if (value === 0) {
      this.pause()
      this.#option.onEnd?.()
    }
  }

  #onTime() {
    this.#rafId = raf(() => {
      if (!this.#counting)
        return
      const { isIncrement } = this.#state
      const cb = this.#onTime.bind(this)
      isIncrement ? this.#increment(cb) : this.#decrement(cb)
    })
  }

  #unOnTime() {
    clearInterval(this.#timer)
    this.#timer = setInterval(() => {
      if (!this.#counting)
        return
      const { isIncrement } = this.#state
      const cb = this.#unOnTime.bind(this)
      isIncrement ? this.#increment(cb) : this.#decrement(cb)
    }, this.offset)
  }

  #decrement(cb: () => void) {
    this.#setCount(Math.max(this.#endTime - Date.now(), 0))
    if (this.#count > 0)
      cb()
  }

  #increment(cb: () => void) {
    const diff = Date.now() - this.#startTime
    this.#setCount(diff)
    if (diff < this.targetTime)
      cb()
  }
}
