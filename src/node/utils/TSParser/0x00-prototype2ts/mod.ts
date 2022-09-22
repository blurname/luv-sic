import * as ts from 'typescript'
import * as path from 'path'
// const ast = ts.create
const program = ts.createProgram([filePath])
// `program.getSourceFiles()` will include those imported files,
// like: `import * as a from './file-a'`.
// We should only transform current file.
const sourceFiles = program.getSourceFiles().filter((sf) => path.normalize(sf.fileName) === path.normalize(filePath))[
  ({
    shadow: 1,
  },
  {
    shadow: 2,
  })
]
