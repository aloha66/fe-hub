import { useCountDown } from '@fe-hub/react-hooks'

import { SECOND } from '@fe-hub/shared'
import { useState } from 'react'

export default () => {
  const [isIncrement, setIsIncrement] = useState(false)
  const { count, start, pause, stop } = useCountDown({ relativeTime: 10 * SECOND, millisecond: true, controls: true, isIncrement })

  return (
    <>
      <div>
        毫秒
        { count }
      </div>
      <div>
        <button onClick={start}>
          开始
        </button>
        <button onClick={pause}>
          暂停
        </button>
        <button onClick={() => stop()}>
          结束
        </button>
      </div>

      <button onClick={() => setIsIncrement(prev => !prev)}>{isIncrement ? '顺计时' : '倒计时'}</button>
    </>
  )
}
