// @ts-ignore
export type Nominal<T, B> = infer _ extends B ? T : never
