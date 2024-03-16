// https://effect.website/
// https://effect.website/docs/introduction
// https://effect-ts.github.io/effect/docs/effect

import React, { useEffect, useState } from 'react'
import { Effect, Schedule, Stream } from 'effect'

export function EffectGround () {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 200, background: '#f002' }}>
<LogInterval/>
    </div>
  )
}

const LogInterval = () => {
  const [valueList, setValueList] = useState([])
  const counts = Stream.fromSchedule(Schedule.spaced(10)).pipe(
    Stream.take(2),
    Stream.map((x) => x * 2),
    Stream.runCollect
  )
  useEffect(() => {
    Effect.runPromise(counts).then((x) => setValueList(x.toJSON().values))
  }, [])
  return <div>
  <h2>LogInterval</h2>
  <div>
  {JSON.stringify(valueList)}
  </div>
  </div>
}
