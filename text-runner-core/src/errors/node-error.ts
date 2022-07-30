/** type guard that indicates errors of filesystem operations */
export function isFsError(arg: unknown): arg is NodeJS.ErrnoException {
  return arg instanceof Error && "code" in arg
}
