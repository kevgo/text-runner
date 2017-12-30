@clionly
Feature: formatter types

  There are different formatter types

  Background:
    Given my source code contains the file "1.md" with content:
      """
      """
    And my source code contains the file "2.md" with content:
      """
      <a class="tr_runConsoleCommand">
      ```
      echo "Hello world"
      ```
      </a>
      <a href="http://external-link.com"></a>
      <
      """

  Scenario Outline: checking output of various formatters
    When trying to run "text-run --format <FORMATTER> --fast"
    Then it signals:
      | FILENAME  | 1.md                  |
      | WARNING   | found empty file 1.md |

    Examples:
      | FORMATTER |
      | detailed  |
      | dot       |
