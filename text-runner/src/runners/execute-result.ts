import { ActivityResult } from "../activity-list/types/activity-result"

/**
 * ExecuteResult represents the result of executing a number of activities.
 *
 * The contained activityResults represent which activities have been executed.
 * The errorCount is the authoritative number of errors encountered.
 * This number can be higher than the errors in the activityResults,
 * since errors can happen outside of executing activities.
 */
export class ExecuteResult {
  activityResults: ActivityResult[]
  errorCount: number

  /** provides an empty ExecuteResult */
  static empty(): ExecuteResult {
    return new ExecuteResult([], 0)
  }

  constructor(activityResults: ActivityResult[], errorCount: number) {
    this.activityResults = activityResults
    this.errorCount = errorCount
  }

  /** provides a new ExecuteResult instance that contains this instance plus the given one */
  merge(other: ExecuteResult): ExecuteResult {
    const result = new ExecuteResult(this.activityResults, this.errorCount)
    result.activityResults.push(...other.activityResults)
    result.errorCount += other.errorCount
    return result
  }

  mergeMany(others: ExecuteResult[]): ExecuteResult {
    const result = new ExecuteResult(this.activityResults, this.errorCount)
    for (const result of others) {
      this.merge(result)
    }
    return result
  }
}
