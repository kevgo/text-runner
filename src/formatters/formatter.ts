/**
 * Formatter is the API that formatters have to implement
 *
 * In general, formatters can print whatever they want.
 * They get information about the current test step through this API.
 */
export interface Formatter {
  /**
   * Error notifies the user of a test failure.
   *
   * This method is called by the test framework when the test step throws an error.
   * The provided error is the one thrown by the test script.
   */
  error(e: Error): void

  /**
   * Log allows to print random test output to the user,
   * for example terminal output.
   *
   * This method is called by the test script (the developer of the test).
   */
  log(text: string): void

  /**
   * Title allows to refine the name of the current step,
   * for example by providing more details.
   *
   * As an example, this method could be called to refine the step name `write file`
   * to `write file "foo.yml"` once the name of the file to be written is known.
   *
   * This method is called by the test step.
   */
  title(text: string): void

  /**
   * Skip notifies the user that the test associated with this formatter
   * is not going to be executed.
   */
  skip(message: string): void

  /**
   * Success notifies the user that the associated activity has been successful.
   *
   * This method is called by the test framework when the test step
   * that is associated with this formatter instance finishes without throwing an exception.
   */
  success(): void

  /**
   * Warning allows to notify the user about an issue that occured and is noteworthy
   * but didn't cause the test to fail.
   *
   * Example: a checker for external links receives a 500 error from the server
   *
   * This method is called by the test step.
   */
  warning(message: string): void
}
