// import assert from 'node:assert'
import { test } from 'node:test'
import { parseArg } from './cli.ts'
test("cli arg",()=>{
  const a = parseArg([
    "--abc=\"123\"",
    "--test-kstring=\"456\"",
    "--test-kboolean",
  ], {
    "--test-kstring": {desc:"test abc", type: 'string'},
    "--test-kboolean": {desc:"test abc", type: 'boolean'},
    "--test-kbool": {desc:"test abc", type: ['a','b','c']}
  })
  // a['--test-kbool']
  console.log()
})
