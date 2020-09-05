import { Formatter } from "./formatter"

export class Counter implements Formatter {
  _errorCount: number
  _successCount: number
  _skipCount: number
  _warnCount: number

  constructor() {
    this._errorCount = 0
    this._successCount = 0
    this._skipCount = 0
    this._warnCount = 0
  }

  success() {
    this._successCount++
  }
  failed() {
    this._errorCount++
  }
  skipped() {
    this._skipCount++
  }
  warning() {
    this._warnCount++
  }

  errorCount(): number {
    return this._errorCount
  }
}
