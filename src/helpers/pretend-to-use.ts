// Signals to the type checker that not using the given variables is okay here
export function pretendToUse(...obj: any[]) {
  obj.toString()
}
