export type Selector<
  S = any,
  R = unknown,
  P extends never | readonly any[] = any[]
> = [P] extends [never] ? (state: S) => R : (state: S, ...params: P) => R
export type OutputSelector<
  S extends SelectorArray,
  Result,
  Params extends readonly any[],
  Combiner
> = Selector<GetStateFromSelectors<S>, Result, Params> & {
  resultFunc: Combiner
  dependencies: SelectorArray
  recomputations: () => number
  resetRecomputations: () => number
}

export type ParametricSelector<S, P, R> = Selector<S, R, [P, ...any]>

export type OutputParametricSelector<S, P, R, C> = ParametricSelector<
  S,
  P,
  R
> & {
  resultFunc: C
  recomputations: () => number
  resetRecomputations: () => number
}

export type SelectorArray = ReadonlyArray<Selector>

type GetStateFromSelector<S> = S extends Selector<infer State> ? State : never
type GetStateFromSelectors<S extends SelectorArray> = S extends [
  infer Current,
  ...infer Other
]
  ? Current extends Selector
    ? Other extends SelectorArray
      ? GetStateFromSelector<Current> | GetStateFromSelectors<Other>
      : GetStateFromSelector<Current>
    : never
  : S extends (infer Elem)[]
  ? GetStateFromSelector<Elem>
  : never

export type GetParamsFromSelector<S> = S extends Selector<any, any, infer P>
  ? P extends []
    ? never
    : P
  : never
export type GetParamsFromSelectors<S, Found = never> = S extends SelectorArray
  ? S extends (infer s)[]
    ? GetParamsFromSelector<s>
    : S extends [infer Current, ...infer Rest]
    ? GetParamsFromSelector<Current> extends []
      ? GetParamsFromSelectors<Rest, Found>
      : GetParamsFromSelector<Current>
    : S
  : Found

export type SelectorResultArray<
  Selectors extends SelectorArray,
  Rest extends SelectorArray = Selectors
> = Rest extends [infer S, ...infer Remaining]
  ? S extends Selector
    ? Remaining extends SelectorArray
      ? [ReturnType<S>, ...SelectorResultArray<Selectors, Remaining>]
      : [ReturnType<S>]
    : []
  : Rest extends ((...args: any) => infer S)[]
  ? S[]
  : []

export type EqualityFn = (a: any, b: any) => boolean