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
   */
  failed(e: Error, output: string): void

  /**
   * Skip notifies the user that the action associated with this formatter
   * was not executed.
   */
  skipped(message: string, output: string): void

  /**
   * Success notifies the user that the activity associated with this formatter has been successful.
   *
   * This method is called by the test framework when the test step
   * that is associated with this formatter instance finishes without throwing an exception.
   */
  success(): void
}
