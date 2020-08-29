import { Activity } from "../../activity-list/types/activity"
import { StatsCounter } from "../../runners/helpers/stats-counter"

/**
 * Formatter is the API that formatters have to implement
 *
 * A formatter formats the steps in the entire test suite.
 * It is given the total number of test steps in the constructor.
 * After each test step is done, the test runtime calls either
 * `success`, `failed`, or `skipped` on the formatter.
 *
 * Formatters shouldn't assume that tests run in any particular order
 * or strictly sequentially.
 */
export interface Formatter {
  /**
   * Error notifies the user that the step associated with this formatter has failed
   * by throwing the given Error.
   *
   * This method is called by the test framework when the test step throws an error.
   *
   * @param actionName the name of the action that just failed
   * @param e the error with which the action failed
   * @param output output provided by the action
   */
  failed(activity: Activity, actionName: string, e: Error, output: string): void

  /**
   * Skip notifies the user that the action associated with this formatter
   * was not executed.
   *
   * @param actionName the name of the action that just failed
   * @param output output provided by the action
   */
  skipped(activity: Activity, actionName: string, output: string): void

  /**
   * Success notifies the user that the activity associated with this formatter has been successful.
   *
   * This method is called by the test framework when the test step
   * that is associated with this formatter instance finishes without throwing an exception.
   *
   * @param actionName the name of the action that just failed
   * @param output output provided by the action
   */
  success(activity: Activity, actionName: string, output: string): void

  /** Summary notifies the user that the test suite is over by printing statistics. */
  summary(statsCounter: StatsCounter): void
}
