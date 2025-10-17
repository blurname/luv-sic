// import assert from 'node:assert'
import {test} from 'node:test'
import {parseOptionList2} from './cli.ts'
test("cli arg",()=>{
  const a = parseOptionList2(["--abc=\"123\""], {
    "--test-kv": {desc:"test abc", type: 'string'},
    "--test-k": {desc:"test abc", type: 'boolean'}
  })
  console.log(a['--test-k'])
})
