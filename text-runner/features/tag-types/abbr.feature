Feature: active ABBR tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active ABBR tag
    Given the source code contains a file "1.md" with content:
      """
      <abbr type="HelloWorld">foo</abbr>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: passive ABBR tag
    Given the source code contains a file "1.md" with content:
      """
      <abbr>foo</abbr>
      """
    When running text-run
