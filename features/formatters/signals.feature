@clionly
Feature: Formatter signals

  Formatters signal the following methods:
  - success
  - error
  - warning


  Scenario Outline: signaling warnings
    Given my source code contains the file "warning.md" with content:
      """
      <a href="http://external-link.com"></a>
      """
    When running "text-run --format <FORMATTER> --fast"

    Examples:
      | FORMATTER |
      | detailed  |
      | dot       |


  Scenario Outline: checking output of various formatters
    Given my source code contains the file "error.md" with content:
      """
      <a class="tr_runJavascript">
      ```
      throw new Error('BOOM!')
      ```
      </a>
      """
    When trying to run "text-run --format <FORMATTER> --fast"
    Then it signals:
      | FILENAME | error.md |
      | ERROR    | BOOM!    |

    Examples:
      | FORMATTER |
      | detailed  |
      | dot       |
