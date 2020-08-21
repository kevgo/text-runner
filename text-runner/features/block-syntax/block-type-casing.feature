Feature: flexible region syntax

  Background:
    Given the source code contains the HelloWorld action

  Scenario: the blocktype is provided in PascalCase
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="HelloWorld">
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: the blocktype is provided in camelCase
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="helloWorld">
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: the blocktype is provided in snake_case
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="hello_world">
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: the blocktype is provided in kebab-case
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="hello-world">
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
