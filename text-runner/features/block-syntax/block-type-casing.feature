Feature: flexible block syntax

  When writing active blocks in a Markdown document
  I want to be able to define the action name in any syntax I want
  So that I don't have to memorize and follow unnecessarily strict syntax rules.

  - the action name can be provided in PascalCase, camelCase, snake_case, or kebab-case


  Background:
    Given the source code contains the HelloWorld action


  Scenario: the blocktype is provided in PascalCase
    Given the source code contains the file "1.md" with content:
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
    Given the source code contains the file "1.md" with content:
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
    Given the source code contains the file "1.md" with content:
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
    Given the source code contains the file "1.md" with content:
      """
      <a textrun="hello-world">
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
