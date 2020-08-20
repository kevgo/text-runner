Feature: Formatter signals

  Formatters signal the following methods:
  - success
  - error
  - skip

  Scenario Outline: checking output of various formatters
    Given the source code contains a file "error.md" with content:
      """
      <a textrun="run-javascript">
      ```
      throw new Error('BOOM!')
      ```
      </a>
      """
    When trying to run "text-run --format <FORMATTER> --offline"
    Then it signals:
      | FILENAME | error.md |
      | ERROR    | BOOM!    |

    Examples:
      | FORMATTER |
      | detailed  |
      | dot       |
      | progress  |
      | summary   |
