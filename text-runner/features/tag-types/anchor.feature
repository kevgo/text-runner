Feature: active anchor tags

  When writing active blocks in a Markdown document
  I want to be able to make anchor tags active
  So that I can make active tags invisible and linkable.


  Background:
    Given the source code contains the HelloWorld action


  Scenario: anchor tag
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="HelloWorld">hello</a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: anchor block
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="HelloWorld">
      hello
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
