type Latency = {
  value: number
  latency: number
  log: (v: number) => void
}

const action1: Latency = {
  value: 1,
  latency: 500,
  log: (v) => {
    console.log(v)
  }
}
const action2: Latency = {
  value: 1,
  latency: 1500,
  log: (v) => {
    console.log(v)
  }
}
const action3: Latency = {
  value: 2,
  latency: 1000,
  log: (v) => {
    console.log(v)
  }
}
const currentLatencyMs = 100000
const actionList: Latency[] = []
const a = performance.now()
setTimeout(() => {
  const b = performance.now()
  console.log(Math.round(b - a))
}, 5000)
