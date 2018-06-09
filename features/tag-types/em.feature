Feature: active em tags

  When writing active blocks in a Markdown document
  I want to be able to make em tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: em tag
    Given my source code contains the file "1.md" with content:
      """
      <em textrun="HelloWorld">foo</em>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
