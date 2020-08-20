Feature: active em tags

    When writing active blocks in a Markdown document
  I want to be able to make em tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given the source code contains the HelloWorld action


  Scenario: em tag
    Given the source code contains a file "1.md" with content:
      """
      <em textrun="HelloWorld">foo</em>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
