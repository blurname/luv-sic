import { creteMonorepo } from '../pkg/monorepo/src/monorepo'

const SUB_PACKAGE_LIST = ['core', 'cli', 'svgminify', 'lost', 'monorepo', 'ui']

const monoRepo = creteMonorepo({ subPkgList: SUB_PACKAGE_LIST })
monoRepo()
