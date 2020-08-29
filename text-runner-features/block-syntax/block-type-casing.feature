Feature: flexible region syntax

  Background:
    Given the source code contains the HelloWorld action

  Scenario: the blocktype is provided in PascalCase
    Given the source code contains a file "1.md" with content:
      """
      <a type="HelloWorld">
      </a>
      """
    When running text-run
    Then it executes:
      | FILENAME | 1.md         |
      | LINE     | 1            |
      | ACTION   | hello-world  |
      | OUTPUT   | Hello World! |

  Scenario: the blocktype is provided in camelCase
    Given the source code contains a file "1.md" with content:
      """
      <a type="helloWorld">
      </a>
      """
    When running text-run
    Then it executes:
      | FILENAME | 1.md         |
      | LINE     | 1            |
      | ACTION   | hello-world  |
      | OUTPUT   | Hello World! |

  Scenario: the blocktype is provided in snake_case
    Given the source code contains a file "1.md" with content:
      """
      <a type="hello_world">
      </a>
      """
    When running text-run
    Then it executes:
      | FILENAME | 1.md         |
      | LINE     | 1            |
      | ACTION   | hello-world  |
      | OUTPUT   | Hello World! |

  Scenario: the blocktype is provided in kebab-case
    Given the source code contains a file "1.md" with content:
      """
      <a type="hello-world">
      </a>
      """
    When running text-run
    Then it executes:
      | FILENAME | 1.md         |
      | LINE     | 1            |
      | ACTION   | hello-world  |
      | OUTPUT   | Hello World! |
