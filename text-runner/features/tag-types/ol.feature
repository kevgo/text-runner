Feature: active OL tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: ordered list tag
    Given the source code contains a file "1.md" with content:
      """
      <ol textrun="HelloWorld">
      <li>one</li>
      </ol>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: LI tag inside an OL
    Given the source code contains a file "1.md" with content:
      """
      <ol>
      <li textrun="HelloWorld">one</li>
      </ol>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 2           |
      | MESSAGE  | Hello world |
