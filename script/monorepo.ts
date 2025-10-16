import { create } from 'node:domain'
import { creteMonorepo } from '../pkg/monorepo/src/monorepo'
import { createPJFilekit } from '../pkg/core/src/node/fileKit'


console.log('🟦[blue]->pjfk: ', pjfk.getJson())

// const monoRepo = creteMonorepo({ subPkgList: SUB_PACKAGE_LIST })
// monoRepo()
