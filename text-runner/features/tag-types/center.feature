Feature: active CENTER tags

  When writing active blocks in a Markdown document
  I want to be able to make CENTER tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given the source code contains the HelloWorld action


  Scenario: active CENTER tag
    Given the source code contains the file "1.md" with content:
      """
      <center textrun="HelloWorld">foo</center>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: passive CENTER tag
    Given the source code contains the file "1.md" with content:
      """
      <center>foo</center>
      """
    When running text-run
