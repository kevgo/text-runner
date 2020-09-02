Feature: HR tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active HR tag
    Given the source code contains a file "1.md" with content:
      """
      <hr type="HelloWorld">
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: inactive HR tag
    Given the source code contains a file "1.md" with content:
      """
      <hr>
      """
    When running Text-Runner

  Scenario: inactive HR Markdown tag
    Given the source code contains a file "1.md" with content:
      """
      ---
      """
    When running Text-Runner
