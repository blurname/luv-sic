// https://leetcode.cn/problems/24-game/description/
//
/**
  * 1. 问题翻译：给定 4 个数字，判断通过四则运算能否获得 24 点，给出表达式
      1. 问题1: 如何判断 24 点
      2. 问题2: 如何给出计算表达式
**/

// my code

// code from https://github.com/Lucifier129
type SolverConfig<Expr, Output> = {
  operands: Expr[],
  operators: ((a: Expr, b: Expr) => Expr)[],
  return: (expr: Expr) => Output
  check: (output: Output) => boolean,
  default: Output,
}

const solver = <Expr, Output>(config: SolverConfig<Expr, Output>) => {
  const { operands, operators } = config

  const solve = (operands: Expr[]): Output => {
    if (operands.length === 1) {
      return config.return(operands[0])
    }

    for (let i = 0; i < operands.length; i++) {
      for (let j = 0; j < operands.length; j++) {
        if (i !== j) {
          const remainOperands: Expr[] = []
          for (let k = 0; k < operands.length; k++) {
            if (k !== i && k !== j) {
              remainOperands.push(operands[k])
            }
          }

          for (const operator of operators) {
            remainOperands.push(operator(operands[i], operands[j]))
            const result = solve(remainOperands)
            if (config.check(result)) {
              return result
            }
            remainOperands.pop()
          }
        }
      }
    }

    return config.default
  }

  return solve(operands)
}

const EPSILON = 1e-6
function judgePoint24 (cards: number[]): boolean {
  return solver({
    operands: cards,
    operators: [
      (a, b) => a + b,
      (a, b) => a - b,
      (a, b) => b - a,
      (a, b) => a * b,
      (a, b) => a / b,
      (a, b) => b / a
    ],
    return: (expr) => Math.abs(expr - 24) < EPSILON,
    check: output => output,
    default: false
  })
}

type Expr = {
  type: 'number',
  value: number
} | {
  type: '+' | '-' | '*' | '/',
  left: Expr,
  right: Expr
  value: number
}

function printExpr (expr: Expr): string {
  if (expr.type === 'number') {
    return expr.value.toString()
  }

  const left = printExpr(expr.left)
  const right = printExpr(expr.right)

  if (expr.type === '+') {
    return `(${left} + ${right})`
  } else if (expr.type === '-') {
    return `(${left} - ${right})`
  } else if (expr.type === '*') {
    return `(${left} * ${right})`
  } else {
    return `(${left} / ${right})`
  }
}

function printPoint24 (cards: number[]) {
  return solver<Expr, string | null>({
    operands: cards.map(value => ({ type: 'number', value })),
    operators: [
      (a, b) => {
        return {
          type: '+',
          left: a,
          right: b,
          value: a.value + b.value
        }
      },
      (a, b) => {
        return {
          type: '-',
          left: a,
          right: b,
          value: a.value - b.value
        }
      },
      (a, b) => {
        return {
          type: '-',
          left: b,
          right: a,
          value: b.value - a.value
        }
      },
      (a, b) => {
        return {
          type: '*',
          left: a,
          right: b,
          value: a.value * b.value
        }
      },
      (a, b) => {
        return {
          type: '/',
          left: a,
          right: b,
          value: a.value / b.value
        }
      },
      (a, b) => {
        return {
          type: '/',
          left: b,
          right: a,
          value: b.value / a.value
        }
      }
    ],
    return: expr => {
      if (Math.abs(expr.value - 24) < EPSILON) {
        return printExpr(expr)
      }
      return null
    },
    check: (output) => {
      return output !== null
    },
    default: null
  })
}

console.log(judgePoint24([1, 2, 3, 4]))
console.log(printPoint24([1, 2, 3, 4]))

console.log(judgePoint24([5, 5, 5, 5]))
console.log(printPoint24([5, 5, 5, 5]))

console.log(judgePoint24([6, 6, 6, 6]))
console.log(printPoint24([6, 6, 6, 6]))

console.log(judgePoint24([3, 3, 7, 7]))
console.log(printPoint24([3, 3, 7, 7]))

console.log(judgePoint24([1, 4, 7, 9]))
console.log(printPoint24([1, 4, 7, 9]))
