Feature: active UL tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: UL tag
    Given the source code contains a file "1.md" with content:
      """
      <ul type="HelloWorld">
        <li>one</li>
      </ul>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: unordered list item tag
    Given the source code contains a file "1.md" with content:
      """
      <ul>
      <li type="HelloWorld">one</li>
      </ul>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 2           |
      | MESSAGE  | Hello world |
