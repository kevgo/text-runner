Feature: Formatter signals

  Scenario Outline: checking output of various formatters
    Given the source code contains a file "error.md" with content:
      """
      <a type="run-javascript">
      throw new Error('BOOM!')
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
