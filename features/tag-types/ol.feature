Feature: active OL tags

  When writing active blocks in a Markdown document
  I want to be able to make OL tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: ordered list tag
    Given my source code contains the file "1.md" with content:
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
    Given my source code contains the file "1.md" with content:
      """
      <ol>
      <li textrun="HelloWorld">one</li>
      </ol>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
