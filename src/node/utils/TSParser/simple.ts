import * as ts from 'typescript'
const source = 'let x: string  = "string"'
const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext }})
const result1 = ts.createSourceFile('hi.ts', source, ts.ScriptTarget.Latest)
console.log(JSON.stringify(result))
console.log(result1)
