@api
Feature: active anchor tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: anchor tag
    Given the source code contains a file "1.md" with content:
      """
      <a type="HelloWorld">hello</a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |

  Scenario: anchor block
    Given the source code contains a file "1.md" with content:
      """
      <a type="HelloWorld">
      hello
      </a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
