@api
Feature: flexible region syntax

  Background:
    Given the source code contains the HelloWorld action

  Scenario: the blocktype is provided in PascalCase
    Given the source code contains a file "1.md" with content:
      """
      <a type="HelloWorld">
      </a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | OUTPUT       | STATUS  |
      | 1.md     | 1    | hello-world | Hello World! | success |

  Scenario: the blocktype is provided in camelCase
    Given the source code contains a file "1.md" with content:
      """
      <a type="helloWorld">
      </a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | OUTPUT       | STATUS  |
      | 1.md     | 1    | hello-world | Hello World! | success |

  Scenario: the blocktype is provided in snake_case
    Given the source code contains a file "1.md" with content:
      """
      <a type="hello_world">
      </a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | OUTPUT       | STATUS  |
      | 1.md     | 1    | hello-world | Hello World! | success |

  Scenario: the blocktype is provided in kebab-case
    Given the source code contains a file "1.md" with content:
      """
      <a type="hello-world">
      </a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | OUTPUT       | STATUS  |
      | 1.md     | 1    | hello-world | Hello World! | success |
