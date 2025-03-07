Feature: active OL tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: ordered list tag
    Given the source code contains a file "1.md" with content:
      """
      <ol type="HelloWorld">
      <li>one</li>
      </ol>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |

  Scenario: LI tag inside an OL
    Given the source code contains a file "1.md" with content:
      """
      <ol>
      <li type="HelloWorld">one</li>
      </ol>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 2    | hello-world |
