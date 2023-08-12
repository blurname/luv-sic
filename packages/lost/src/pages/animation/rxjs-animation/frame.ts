import { Observable, Subscriber } from 'rxjs'

type SubscribeInfo = {
  subscriber: Subscriber<number>;
  startTime: number;
};

const subscriberInfoList: SubscribeInfo[] = []
let isStarted = false
let requestId = -1

const tick = () => {
  const list = [...subscriberInfoList]
  const currentTime = Date.now()

  for (let i = 0; i < list.length; i++) {
    const { subscriber, startTime } = list[i]
    subscriber.next(currentTime - startTime)
  }

  if (subscriberInfoList.length) {
    requestId = requestAnimationFrame(tick)
  }
}

const start = () => {
  if (isStarted) return
  isStarted = true
  requestId = requestAnimationFrame(tick)
}

export const frame = () =>
  new Observable<number>((subscriber) => {
    const subscriberInfo = {
      subscriber,
      startTime: Date.now()
    }
    subscriberInfoList.push(subscriberInfo)
    start()
    return () => {
      const index = subscriberInfoList.indexOf(subscriberInfo)
      if (index !== -1) {
        subscriberInfoList.splice(index, 1)
      }
      if (subscriberInfoList.length === 0) {
        isStarted = false
        cancelAnimationFrame(requestId)
      }
    }
  })
