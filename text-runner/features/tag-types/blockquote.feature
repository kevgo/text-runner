Feature: active blockquote tags

  When writing active blocks in a Markdown document
  I want to be able to make blockquote tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given the source code contains the HelloWorld action


  Scenario: blockquote tag
    Given the source code contains the file "1.md" with content:
      """
      <blockquote textrun="HelloWorld">hello</blockquote>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
