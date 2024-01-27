/**
 * 状态机
 * 存储状态和状态变更的函数操作
 * 注册和派发事件
 */

type StateTransferFuntion = (...args: unknown[]) => void

export class StateMachine<S extends number, A extends number> {
  #curState: S

  #table: Map<S, Map<A, [StateTransferFuntion, S]>>

  constructor(initState: S) {
    this.#curState = initState
    this.#table = new Map()
  }

  /**
   * 当前状态
   */
  get curState() {
    return this.#curState
  }

  /**
   * 状态对照表
   */
  get table() {
    return this.#table
  }

  /**
   * 注册状态
   * @param from 从状态
   * @param to 到状态
   * @param action 触发的行为
   * @param fn 执行逻辑
   */
  register(from: S, to: S, action: A, func: StateTransferFuntion) {
    if (!this.#table.has(from))
      this.#table.set(from, new Map())
    const adjTable = this.#table.get(from)!
    adjTable.set(action, [func, to])
  }

  #getAdjTable(action: A) {
    const adjTable = this.#table.get(this.#curState)
    if (!adjTable)
      return false

    if (!adjTable.has(action))
      return false

    return adjTable.get(action)!
  }

  /**
   * 派发
   * @param action 行为
   * @param data 参数
   * @returns
   */
  async dispatch(action: A, ...data: unknown[]) {
    const adjTable = this.#getAdjTable(action)
    if (!adjTable)
      return false

    const [func, to] = adjTable
    await func(...data)
    this.#curState = to
    // action复位到auto
    while (await this.dispatch(0 as A, ...data)) ;

    return true
  }

  dispatchSync(action: A, ...data: unknown[]) {
    const adjTable = this.#getAdjTable(action)
    if (!adjTable)
      return false

    const [func, to] = adjTable
    func(...data)
    this.#curState = to
    /**
     * action复位到auto
     * 在注册事件当中，我们会注册这个事件
     * editor.register(States.Stoped, States.Start, Actions.AUTO, mock)
     * 状态从结束到开始，执行action是auto
     *
     * 每次执行dispatch后，都进行复位试探
     * 如果当前状态是States.Stoped
     * this.#table.get(this.#curState)就会有这个action
     * 然后自动复位到States.Start
     */
    while (this.dispatchSync(0 as A, ...data)) ;

    return true
  }
}
