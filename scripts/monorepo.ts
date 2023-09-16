import { creteMonoRepo } from '../packages/monorepo/src/monorepo.js'
const SUB_PACKAGE_LIST = ['core', 'cli', 'svgminify', 'lost', 'monorepo']

const monoRepo = creteMonoRepo(SUB_PACKAGE_LIST)
monoRepo()

// export {
//   SUB_PACKAGE_LIST
// }
