@cli
Feature: Formatter signals

  Scenario Outline: checking output of various formatters
    Given the source code contains a file "error.md" with content:
      """
      <pre type="javascript/runnable">
      throw new Error("BOOM!")
      </pre>
      """
    When trying to run "text-runner --format=<FORMATTER>"
    Then it signals:
      | FILENAME | error.md |
      | ERROR    | BOOM!    |

    Examples:
      | FORMATTER |
      | detailed  |
      | dot       |
      | progress  |
      | summary   |
