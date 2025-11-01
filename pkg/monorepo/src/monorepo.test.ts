// import assert from 'node:assert'
import { test,  } from 'node:test'
import {createTagPush, isTagCreatedEff} from './tag-push.js'
import {strictEqual} from 'assert'
import {createPJFilekit} from '@blurname/core/src/node/fileKit.js'
import {getCallPath} from '@blurname/core/src/node/cli.js'
test("cli arg",()=>{
  strictEqual(isTagCreatedEff("v0.0.10"), true)
  strictEqual(isTagCreatedEff("v0.0.100000000"), false)

  const pjfk = createPJFilekit({path: getCallPath()})
  createTagPush(pjfk)
})

