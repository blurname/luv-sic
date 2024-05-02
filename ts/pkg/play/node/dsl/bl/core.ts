type Query = {
  type: 'query'
}
type Add = {
  type: 'add'
}
type Delete = {
  type: 'delete'
}
type Update = {
  type: 'update'
}
type Parens = {
  type: 'parens'
  value: '(' | ')'
}
type Result = {
  type: 'result'
  value: any
}
type From = {
  type: 'from'
}
type Where = {
  type: 'where'
}
type WhereExpression = {
  type: 'whereExpression'
  value: `${string} >= ${string}` | `${string} === ${string}` | `${string} <= ${string}`
}
type Expression = {
  type: 'expression'
}

type Command = Add | Delete | Update

type Token = Query | Command | Parens | Result | From | Where | WhereExpression
const Tokenizer = (input: String) => {
  const tokens: Token[] = []
  const source = input.split(' ')
  source.map((s) => {
    if (s === 'query') {
      tokens.push({
        type: 'query',
      })
    } else if (s === '(') {
      tokens.push({
        type: 'parens',
        value: '(',
      })
      // eslint-disable-next-line no-empty
    } else if (s === 'result') {
    } else if (s === ')') {
      tokens.push({
        type: 'parens',
        value: ')',
      })
    } else if (s === 'from') {
      tokens.push({
        type: 'from',
      })
    } else if (s === 'where') {
      tokens.push({
        type: 'where',
      })
    }
  })
}
const parensTokenizer = (source: String[], tokens: Token[]) => {}
const whereTokenizer = (source: String[], tokens: Token[]) => {}
export {}
