Feature: active UL tags

    When writing active blocks in a Markdown document
  I want to be able to make UL tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given the source code contains the HelloWorld action


  Scenario: UL tag
    Given the source code contains a file "1.md" with content:
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
    Given the source code contains a file "1.md" with content:
      """
      <ul>
      <li textrun="HelloWorld">one</li>
      </ul>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 2           |
      | MESSAGE  | Hello world |
