export type NArray<T, N extends number> = N extends N ? (number extends N ? T[] : _NArray<T, N, []>) : never;
type _NArray<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _NArray<T, N, [T, ...R]>;
type NArrayNumber<L extends number> = NArray<number, L>;
export type Add<M extends number, N extends number> = [...NArrayNumber<M>, ...NArrayNumber<N>]['length'];
export type Subtract<M extends number, N extends number> = NArrayNumber<M> extends [...x: NArrayNumber<N>, ...rest: infer R] ? R['length'] : unknown;
type _Subtract<M extends number, N extends number> = NArrayNumber<M> extends [...x: NArrayNumber<N>, ...rest: infer R] ? R['length'] : -1;
type _Multiply<M extends number, N extends number, res extends unknown[]> = N extends 0 ? res['length'] : _Multiply<M, _Subtract<N, 1>, [...NArray<number, M>, ...res]>;
export type Multiply<M extends number, N extends number> = _Multiply<M, N, []>;
type _DivideBy<M extends number, N extends number, res extends unknown[]> = M extends 0 ? res["length"] : _Subtract<M, N> extends -1 ? unknown : _DivideBy<_Subtract<M, N>, N, [unknown, ...res]>;
export type DividedBy<M extends number, N extends number> = N extends 0 ? unknown : _DivideBy<M, N, []>;
export {};
//# sourceMappingURL=lisp-interpreter.d.ts.map