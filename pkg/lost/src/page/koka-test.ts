import { Eff } from 'koka'
import { setTimeoutAsync } from '@blurname/core/src/common/promise.js'
function * fetchUser ({ userId }: {userId: string}) {
  yield * Eff.await(setTimeoutAsync(1000))
  // yield * Eff.await(setTimeoutAsync(1000))
  if (userId === '0') {
    throw yield * Eff.err('userId0').throw({ 'abc': 1, 'def': 2 })
  }
  const asfValue = yield * Eff.ctx('asf').get()
  return { userId, userName: 'anonymous', asfValue }
}

function * mainAsync () {
  // const res01 = await Eff.run(Eff.result(fetchUser({ userId: '0' })))
  // const res02 = await Eff.run(Eff.result(fetchUser({ userId: '1' })))
  // console.log('🟦[blue]->res0: ', res01, res02)
  // const res = await Eff.run(fetchUser({ userId: '1' }))
  // const res1 = Eff.run(Eff.result(Eff.try(fetchUser({ userId: '1' })).catch({
  //   userId0: () => {
  //     return null
  //   }
  // })))
  // const res2 = Eff.run(Eff.result(Eff.try(fetchUser({ userId: '0' })).catch({
  //   userId0: (i) => {
  //     return null
  //   }
  // })))
  // console.log('🟦[blue]->res: ', res1, res2)
  console.log('hello')
  const res01 = yield * Eff.try(fetchUser({ userId: '1' })).catch({
    userId0: (i) => {
      console.log('🟦[blue]->i: ', i)
      return null
    },
    'asf': 1
  })
  console.log('🟦[blue]->res01: ', res01)
}
Eff.run(mainAsync())
// const result = () => {
//   function * testFailure () {
//     yield * Eff.ok(Eff.result(Eff.err('TestError').throw('error')))
//   }
//
//   const failureResult = Eff.run(
//     Eff.try(testFailure).catch({
//       TestError: (error) => `Caught: ${error}`
//     })
//   )
//   console.log('🟦[blue]->failureResult: ', failureResult)
// }
mainAsync()
// result()
