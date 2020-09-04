import { ActivityResult } from "../activity-list/types/activity-result"

/**
 * ExecuteResult represents the result of executing a number of activities.
 */
export class ExecuteResult {
  /** the activities that have been executed */
  activityResults: ActivityResult[]

  /**
   * the authoritative number of errors encountered
   *
   * This number can be higher than the errors in the activityResults,
   * since errors can happen outside of executing activities.
   */
  errorCount: number

  /**
   * The warnings encountered
   */
  warnings: string[]

  /** provides an empty ExecuteResult */
  static empty(): ExecuteResult {
    return new ExecuteResult([], 0, [])
  }

  /** provides an ExecuteResult containing the given warning */
  static warning(message: string): ExecuteResult {
    return new ExecuteResult([], 0, [message])
  }

  constructor(activityResults: ActivityResult[], errorCount: number, warnings: string[]) {
    this.activityResults = activityResults
    this.errorCount = errorCount
    this.warnings = warnings
  }

  /** ExecuteResult.merge provides a new ExecuteResult instance that contains this instance plus the given one */
  merge(...others: ExecuteResult[]): ExecuteResult {
    let result = new ExecuteResult(this.activityResults, this.errorCount, this.warnings)
    for (const other of others) {
      result.activityResults.push(...other.activityResults)
      result.errorCount += other.errorCount
    }
    return result
  }
}
