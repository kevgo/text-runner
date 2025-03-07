export function errorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message
  } else {
    return String(err)
  }
}
