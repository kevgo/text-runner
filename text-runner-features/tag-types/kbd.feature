Feature: KBD tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: code tag
    Given the source code contains a file "1.md" with content:
      """
      <kbd type="HelloWorld">foo</kbd>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: inactive HR tag
    Given the source code contains a file "1.md" with content:
      """
      <kbd>foo</kbd>
      """
    When running Text-Runner
