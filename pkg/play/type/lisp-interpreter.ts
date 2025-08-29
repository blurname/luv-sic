// 测试用例，由于性能原因，loading 的时间会比较久，实在没 load 出来可以刷新一下重试 o(╥﹏╥)o
type _Test = EvalProgram<`
    (def zero 0)

    (def acc (x) 
        (if (== x zero) 
            x
            (+ x (acc (- x 1))) 
        )
    )

    (acc 3)
`>

// 基本运算
export type NArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _NArray<T, N, []>
  : never
type _NArray<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _NArray<T, N, [T, ...R]>
type NArrayNumber<L extends number> = NArray<number, L>

// 加法
export type Add<M extends number, N extends number> = [
  ...NArrayNumber<M>,
  ...NArrayNumber<N>,
]['length']

// 减法
export type Subtract<M extends number, N extends number> =
  NArrayNumber<M> extends [...x: NArrayNumber<N>, ...rest: infer R]
    ? R['length']
    : unknown

// 主要用于辅助推导乘除法; 否则会因为 Subtract 返回类型为 number | unknown 报错
type _Subtract<M extends number, N extends number> =
  NArrayNumber<M> extends [...x: NArrayNumber<N>, ...rest: infer R]
    ? R['length']
    : -1

// 乘法
type _Multiply<
  M extends number,
  N extends number,
  res extends unknown[],
> = N extends 0
  ? res['length']
  : _Multiply<M, _Subtract<N, 1>, [...NArray<number, M>, ...res]>
export type Multiply<M extends number, N extends number> = _Multiply<M, N, []>

// 除法
type _DivideBy<
  M extends number,
  N extends number,
  res extends unknown[],
> = M extends 0
  ? res['length']
  : _Subtract<M, N> extends -1
    ? unknown
    : _DivideBy<_Subtract<M, N>, N, [unknown, ...res]>
export type DividedBy<M extends number, N extends number> = N extends 0
  ? unknown
  : _DivideBy<M, N, []>

// Result 封装
type ErrorResult<E> = { type: 'Error'; error: E }
type SuccessResult<R> = { type: 'Success'; result: R }

// Safe
type Safe<
  T,
  Reference,
  Default extends Reference = Reference,
> = T extends Reference ? T : Default

// 基本字符
type SpaceChars = ' ' | '\n'
type AlphaChars =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
type NumberChars = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type PairChars = '(' | ')'
type SymbolChars = '+' | '-' | '*' | '/' | '=' | '>' | '<' | '&' | '|' | '!'

// 解析 Token
type TokenError<M extends string> = ErrorResult<`[ParseTokenError]: ${M}`>
type TokenResult<
  Matched extends TokenType[],
  Next extends string,
> = SuccessResult<{ matched: Matched; next: Next }>
type TokenType = string | number

type ParseSpace<
  Input extends string,
  Matched extends string = '',
> = Input extends `${SpaceChars}${infer Next}`
  ? ParseSpace<Next, ' '>
  : Matched extends ''
    ? TokenError<'Can not match spaces'>
    : TokenResult<[], Input>

// type _Test = ParseSpace<' \n awefaw'>

type ParseIdentifier<Input extends string> =
  Input extends `${infer Char}${infer Next}`
    ? Char extends AlphaChars
      ? _ParseIdentifierBody<Next, Char>
      : TokenError<'Can not match identifier'>
    : TokenError<'Can not match identifier'>

type _ParseIdentifierBody<
  Input extends string,
  Matched extends string,
> = Input extends `${infer Char}${infer Next}`
  ? Char extends AlphaChars | NumberChars
    ? _ParseIdentifierBody<Next, `${Matched}${Char}`>
    : TokenResult<[Matched], Input>
  : TokenResult<[Matched], Input>

// type _Test = ParseIdentifier<'ab12c 13 asdf'>
type _CharToNumber<C extends string> = C extends '0'
  ? 0
  : C extends '1'
    ? 1
    : C extends '2'
      ? 2
      : C extends '3'
        ? 3
        : C extends '4'
          ? 4
          : C extends '5'
            ? 5
            : C extends '6'
              ? 6
              : C extends '7'
                ? 7
                : C extends '8'
                  ? 8
                  : C extends '9'
                    ? 9
                    : 0

type _SafeAdd<L extends number, R extends number> = Safe<Add<L, R>, number, 0>
type _SafeMulti<L extends number, R extends number> = Safe<
  Multiply<L, R>,
  number,
  0
>

type _StringToNumber<
  S extends string,
  R extends number = 0,
> = S extends `${infer N}${infer Next}`
  ? _StringToNumber<Next, _SafeAdd<_SafeMulti<R, 10>, _CharToNumber<N>>>
  : R

// type _Test = _StringToNumber<'39'>;

type ParseNumber<
  Input extends string,
  Matched extends string = '',
> = Input extends `${infer Char}${infer Next}`
  ? Char extends NumberChars
    ? ParseNumber<Next, `${Matched}${Char}`>
    : Matched extends ''
      ? TokenError<'Can not match number'>
      : TokenResult<[_StringToNumber<Matched>], Input>
  : Matched extends ''
    ? TokenError<'Can not match number'>
    : TokenResult<[_StringToNumber<Matched>], Input>

// type _Test = ParseNumber<'1123 awef'>

type ParsePair<Input extends string> =
  Input extends `${infer Char}${infer Next}`
    ? Char extends PairChars
      ? TokenResult<[Char], Next>
      : TokenError<'Can not match pair'>
    : TokenError<'Can not match pair'>

// type _Test = ParsePair<')'>

type ParseSymbol<
  Input extends string,
  Matched extends string = '',
> = Input extends `${infer Char}${infer Next}`
  ? Char extends SymbolChars
    ? ParseSymbol<Next, `${Matched}${Char}`>
    : Matched extends ''
      ? TokenError<'Can not match number'>
      : TokenResult<[Matched], Input>
  : Matched extends ''
    ? TokenError<'Can not match number'>
    : TokenResult<[Matched], Input>

// type _Test = ParseSymbol<'&& '>

type Tokenize<
  Input extends string,
  Tokens extends TokenType[] = [],
> = Input extends ''
  ? TokenResult<Tokens, ''>
  : ParseSpace<Input> extends TokenResult<infer R, infer Next>
    ? Tokenize<Next, [...Tokens, ...R]>
    : ParseIdentifier<Input> extends TokenResult<infer R, infer Next>
      ? Tokenize<Next, [...Tokens, ...R]>
      : ParseNumber<Input> extends TokenResult<infer R, infer Next>
        ? Tokenize<Next, [...Tokens, ...R]>
        : ParsePair<Input> extends TokenResult<infer R, infer Next>
          ? Tokenize<Next, [...Tokens, ...R]>
          : ParseSymbol<Input> extends TokenResult<infer R, infer Next>
            ? Tokenize<Next, [...Tokens, ...R]>
            : TokenError<'Unexpted char'>

// type _Test = Tokenize<`(def a 29)`> // 数字最高解析到 29 极限了

// 基本的栈结构封装
// type StackType<T> = T[]
// type Pop<Stack extends StackType<any>>
//     = Stack extends [...infer _S, infer _Top] ? SuccessResult<{}>
//     : ErrorResult<'Stack is Empty'>;
// type Push<Stack extends StackType<any>, T>
//     = [...Stack, T];

type NodeType = TokenType | NodeType[]
type _SafeTokens<Tokens> = Safe<Tokens, TokenType[], []>
type _SafeToken<Token> = Safe<Token, TokenType, 0>

type NodeStackType = NodeType[][]
type NodeStackPush<Stack extends NodeStackType, Top extends NodeType[]> = [
  ...Stack,
  Top,
]
type NodeStackPopResult<Stack extends NodeStackType, Top extends NodeType[]> = {
  stack: Stack
  top: Top
}
type NodeStackPop<Stack extends NodeStackType> = Stack extends [
  ...infer Tail,
  infer Top,
]
  ? NodeStackPopResult<Safe<Tail, NodeStackType, []>, Safe<Top, NodeType[], []>>
  : ErrorResult<'Can not pop empty stack'>

type ParseError = ErrorResult<'ParseError'>

type _Parse<
  Tokens extends TokenType[],
  Stack extends NodeStackType = [[]],
> = Tokens extends [infer Token, ...infer Next]
  ? Token extends '('
    ? _Parse<_SafeTokens<Next>, NodeStackPush<Stack, []>>
    : NodeStackPop<Stack> extends NodeStackPopResult<infer TailStack, infer Top>
      ? Token extends ')'
        ? NodeStackPop<TailStack> extends NodeStackPopResult<
            infer _TailStack,
            infer _Top
          >
          ? _Parse<_SafeTokens<Next>, NodeStackPush<_TailStack, [..._Top, Top]>>
          : ParseError
        : _Parse<
            _SafeTokens<Next>,
            NodeStackPush<TailStack, [...Top, Safe<Token, TokenType, 0>]>
          >
      : ParseError
  : Stack

type ParseResult<R extends NodeType[]> = { result: R }
type Parse<Code extends string> =
  Tokenize<Code> extends TokenResult<infer Tokens, infer _>
    ? _Parse<Tokens> extends infer R
      ? R extends [infer _R]
        ? ParseResult<Safe<_R, NodeType[], []>>
        : ParseError
      : ParseError
    : ParseError

type Func<Args extends string[], Body extends NodeType> = {
  args: Args
  body: Body
}
type FuncType = Func<string[], NodeType>
type ValueType = number | FuncType
type EnvType = { [name: string]: ValueType }
type MergeEnv<Env extends EnvType, Append extends EnvType> = Omit<
  Env,
  keyof Append
> &
  Append
type EvalResult<Result extends number, Env extends EnvType> = {
  result: Result
  env: Env
}
type EvalError<M extends string = ''> = ErrorResult<`EvalError: ${M}`>

type EvalStackFrame<
  Callee extends string,
  Left extends NodeType[],
  Right extends number[],
  Env extends EnvType,
> = { callee: Callee; left: Left; right: Right; env: Env }
type EvalStackFrameType = EvalStackFrame<string, NodeType[], number[], EnvType>
type EvalStackType = EvalStackFrameType[]

type EvalStackPush<
  Stack extends EvalStackType,
  Frame extends EvalStackFrameType,
> = [...Stack, Frame]
type EvalStackPopResult<
  Stack extends EvalStackType,
  Top extends EvalStackFrameType,
> = { stack: Stack; top: Top }
type EvalStackPop<Stack extends EvalStackType> = Stack extends [
  ...infer Tail,
  infer Top,
]
  ? EvalStackPopResult<
      Safe<Tail, EvalStackType, []>,
      Safe<Top, EvalStackFrameType>
    >
  : EvalError

type SafeNum<N> = Safe<N, number, 0>

type FuncEnv<
  Names extends string[],
  Values extends number[],
  Env extends EnvType,
> = [Names, Values] extends [
  [infer Name, ...infer NextNames],
  [infer Value, ...infer NextValues],
]
  ? FuncEnv<
      Safe<NextNames, string[], []>,
      Safe<NextValues, number[], []>,
      MergeEnv<Env, { [key in Safe<Name, string, ''>]: SafeNum<Value> }>
    >
  : Env

// type _Test = FuncEnv<['a', 'b', 'c'], [1, 2, 3], {}>;

// 只实现 + - == if
type _EvalExpr<Stack extends EvalStackType> =
  EvalStackPop<Stack> extends EvalStackPopResult<infer TailStack, infer Frame>
    ? Frame extends EvalStackFrame<
        infer Callee,
        infer Left,
        infer Right,
        infer Env
      >
      ? [Callee, Right, Left] extends [
          'if',
          [infer Test],
          [infer Consequent, infer Alternate],
        ]
        ? Test extends 0
          ? _Return<Safe<Alternate, NodeType, 0>, TailStack>
          : _Return<Safe<Consequent, NodeType, 0>, TailStack>
        : Left extends [infer E, ...infer Next]
          ? E extends number
            ? _EvalExpr<
                EvalStackPush<
                  TailStack,
                  EvalStackFrame<
                    Callee,
                    Safe<Next, NodeType[], []>,
                    [...Right, E],
                    Env
                  >
                >
              >
            : E extends string
              ? Env[E] extends number
                ? _EvalExpr<
                    EvalStackPush<
                      TailStack,
                      EvalStackFrame<
                        Callee,
                        Safe<Next, NodeType[], []>,
                        [...Right, SafeNum<Env[E]>],
                        Env
                      >
                    >
                  >
                : EvalError<'0'>
              : E extends [infer NextCallee, ...infer NextLeft]
                ? NextCallee extends string
                  ? NextLeft extends NodeType[]
                    ? _EvalExpr<
                        EvalStackPush<
                          EvalStackPush<
                            TailStack,
                            EvalStackFrame<
                              Callee,
                              Safe<Next, NodeType[], []>,
                              Right,
                              Env
                            >
                          >,
                          EvalStackFrame<NextCallee, NextLeft, [], Env>
                        >
                      >
                    : EvalError<'1'>
                  : EvalError<'2'>
                : EvalError<'3'>
          : [Callee, Right] extends ['+', [infer L, infer R]]
            ? _Return<SafeNum<Add<SafeNum<L>, SafeNum<R>>>, TailStack>
            : [Callee, Right] extends ['-', [infer L, infer R]]
              ? _Return<SafeNum<Subtract<SafeNum<L>, SafeNum<R>>>, TailStack>
              : [Callee, Right] extends ['!=', [infer L, infer R]]
                ? _Return<L extends R ? 0 : 1, TailStack>
                : [Callee, Right] extends ['==', [infer L, infer R]]
                  ? _Return<L extends R ? 1 : 0, TailStack>
                  : [Callee, Right] extends ['id', [infer V]]
                    ? _Return<Safe<V, NodeType, 0>, TailStack>
                    : Env[Callee] extends Func<infer Names, infer Body>
                      ? _EvalExpr<
                          EvalStackPush<
                            TailStack,
                            EvalStackFrame<
                              'id',
                              [Body],
                              [],
                              FuncEnv<Names, Right, Env>
                            >
                          >
                        >
                      : EvalError<'4'>
      : EvalError<'5'>
    : EvalError<'6'>

type _Return<Expr extends NodeType, Stack extends EvalStackType> =
  EvalStackPop<Stack> extends EvalStackPopResult<
    infer TailStack,
    EvalStackFrame<infer Callee, infer Left, infer Right, infer Env>
  >
    ? Expr extends number
      ? _EvalExpr<
          EvalStackPush<
            TailStack,
            EvalStackFrame<Callee, Left, [...Right, Expr], Env>
          >
        >
      : _EvalExpr<
          EvalStackPush<
            TailStack,
            EvalStackFrame<Callee, [Expr, ...Left], Right, Env>
          >
        >
    : Expr extends number
      ? EvalResult<Expr, {}>
      : EvalError<'7'>

type _DefStat<Name extends string, Expr extends NodeType> = ['def', Name, Expr]
type _DefFunc<
  Name extends string,
  Args extends string[],
  Body extends NodeType,
> = ['def', Name, Args, Body]

type _EvalProgram<
  Stats extends NodeType[],
  Env extends EnvType,
  R extends number,
> = Stats extends [infer Stat, ...infer NextStats]
  ? NextStats extends NodeType[]
    ? Stat extends _DefFunc<infer Name, infer Args, infer Body>
      ? _EvalProgram<
          NextStats,
          MergeEnv<Env, { [name in Name]: Func<Args, Body> }>,
          0
        >
      : Stat extends _DefStat<infer Name, infer Expr>
        ? _EvalExpr<[EvalStackFrame<'id', [Expr], [], Env>]> extends EvalResult<
            infer R,
            infer _
          >
          ? _EvalProgram<NextStats, MergeEnv<Env, { [name in Name]: R }>, R>
          : EvalError<'8'>
        : Stat extends NodeType
          ? _EvalExpr<
              [EvalStackFrame<'id', [Stat], [], Env>]
            > extends EvalResult<infer R, infer _>
            ? _EvalProgram<NextStats, Env, R>
            : EvalError<'7'>
          : EvalError<'9'>
    : EvalError<'10'>
  : EvalResult<R, Env>

type EvalProgram<S extends string> =
  Parse<S> extends ParseResult<infer Nodes>
    ? _EvalProgram<Nodes, {}, 0>
    : ParseError
export {}
