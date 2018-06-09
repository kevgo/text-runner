Feature: active anchor tags

  When writing active blocks in a Markdown document
  I want to be able to make anchor tags active
  So that I can make active tags invisible and linkable.


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: anchor tag
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="HelloWorld">hello</a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: anchor block
    Given my source code contains the file "1.md" with content:
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
