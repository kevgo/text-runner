Feature: active SUP tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active tag
    Given the source code contains a file "1.md" with content:
      """
      <sup type="HelloWorld">foo</sup>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: passive tag
    Given the source code contains a file "1.md" with content:
      """
      <sup>foo</sup>
      """
    When running Text-Runner
