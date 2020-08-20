Feature: active code tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: code tag
    Given the source code contains a file "1.md" with content:
      """
      <code textrun="HelloWorld">foo</code>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: a list contains an indented code block
    Given the source code contains a file "1.md" with content:
      """
      - a list with an

            indented code block
      """
    When running text-run
