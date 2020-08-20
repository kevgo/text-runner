Feature: active CENTER tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active CENTER tag
    Given the source code contains a file "1.md" with content:
      """
      <center textrun="HelloWorld">foo</center>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: passive CENTER tag
    Given the source code contains a file "1.md" with content:
      """
      <center>foo</center>
      """
    When running text-run
