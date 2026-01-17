// import assert from 'node:assert'
import { test } from 'node:test'
// import { createCliStoreEff, parseArg } from './cli'
import {createCommand, createCommandStore} from './command'
test("command",()=>{
  const testCS = createCommandStore({
    commandKV: {
      'test1':createCommand({
        // name: 'test1',
        desc: 'just test',
        fn: () =>{
          console.log('teset')
          return 'test1'
        }
      }),
      'test2':createCommand({
        // name: 'test2',
        desc: 'just test test',
        fn: () =>{
          console.log('teset test2sd')
          return Math.random()
          // return 'test2'
        }
      })
    }
  })

  // const res =testCS.runCommand('test2')
  // const res =testCS.runCommand('test1')
  testCS.runCommandUnknown('askdjf')
})

