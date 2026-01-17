// import assert from 'node:assert'
import { test } from 'node:test'
import { createCliStoreEff, parseArg } from './cli'
test("cli arg",()=>{
  const a = parseArg([
    "--abc=123",
    "--test-string=456",
    "--test-boolean",
    "--test-number=987",
  ], {
    "--test-string": {desc:"test abc", type: 'string'},
    "--test-boolean": {desc:"test abc", type: 'boolean'},
    "--test-bool": {desc:"test abc", type: 'or', value: ['a','b','c']},
    "--test-number": {desc:"test abc", type: 'number'}
  })
  console.log(a)
  // a['--test-kbool']

  const res = createCliStoreEff({arg:{
    "--test-1": {desc:"test abc", type: 'string'},
    "--test-2": {desc:"test abc", type: 'boolean'},
    "--test-3": {desc:"test abc", type: 'or', value: ['a','b','c']},
    "--test-4": {desc:"test abc", type: 'number'},
  }})
  const res1 = res.getArg('--test-1')
  const res2 = res.getArg('--test-2')
  const res3 = res.getArg('--test-3')
})
