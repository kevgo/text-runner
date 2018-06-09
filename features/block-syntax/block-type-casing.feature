Feature: flexible block syntax

  When writing active blocks in a Markdown document
  I want to be able to define the block type in any syntax I want
  So that I don't have to memorize and follow unnecessarily strict syntax rules.

  - the activity type can be provided in PascalCase, camelCase, snake_case, and kebab-case


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: the blocktype is provided in PascalCase
    Given my source code contains the file "1.md" with content:
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
    Given my source code contains the file "1.md" with content:
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
    Given my source code contains the file "1.md" with content:
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
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="hello-world">
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
