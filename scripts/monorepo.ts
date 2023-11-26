import { creteMonorepo } from '../package/monorepo/src/monorepo.js'
const SUB_PACKAGE_LIST = ['core', 'cli', 'svgminify', 'lost', 'monorepo']

const monoRepo = creteMonorepo({ subPkgList: SUB_PACKAGE_LIST })
monoRepo()
