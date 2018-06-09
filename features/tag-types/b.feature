Feature: active bold tags

  When writing active blocks in a Markdown document
  I want to be able to make bold tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: bold tag
    Given my source code contains the file "1.md" with content:
      """
      <b textrun="HelloWorld">hello</b>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
