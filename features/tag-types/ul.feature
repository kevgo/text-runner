Feature: active UL tags


  When writing active blocks in a Markdown document
  I want to be able to make UL tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: UL tag
    Given my source code contains the file "1.md" with content:
      """
      <ul textrun="HelloWorld">
        <li>one</li>
      </ul>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: unordered list item tag
    Given my source code contains the file "1.md" with content:
      """
      <ul>
      <li textrun="HelloWorld">one</li>
      </ul>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
