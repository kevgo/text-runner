import { Formatter } from "../formatter"

/** A completely minimalistic formatter, prints nothing */
export class SilentFormatter implements Formatter {
  constructor() {}
  errorCount(): number {
    return this.errorCount()
  }
}
