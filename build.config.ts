import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/node/scripts/main.ts',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
