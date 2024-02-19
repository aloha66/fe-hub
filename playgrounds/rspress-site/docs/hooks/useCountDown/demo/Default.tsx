import { useCountDown } from '@fe-hub/react-hooks'

import { DAY, HOUR, MINUTE, SECOND } from '@fe-hub/shared'

export default () => {
  const second = useCountDown({ relativeTime: 10 * SECOND })

  const minuts = useCountDown({ relativeTime: 10 * MINUTE })
  const hour = useCountDown({ relativeTime: 10 * HOUR })
  const day = useCountDown({ relativeTime: 10 * DAY })

  return (
    <>
      <div>{JSON.stringify(second)}</div>
      <div>{JSON.stringify(minuts)}</div>
      <div>{JSON.stringify(hour)}</div>
      <div>{JSON.stringify(day)}</div>
    </>
  )
}
