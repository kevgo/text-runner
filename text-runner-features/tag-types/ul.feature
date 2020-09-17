@api
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
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |

  Scenario: unordered list item tag
    Given the source code contains a file "1.md" with content:
      """
      <ul>
      <li type="HelloWorld">one</li>
      </ul>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 2    | hello-world |
