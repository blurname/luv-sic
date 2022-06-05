import * as ts from 'typescript'

const source = 'let x: string  = "string"'

const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }})

console.log(JSON.stringify(result))
