Feature: active ABBR tags

  When writing active blocks in a Markdown document
  I want to be able to make ABBR tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my source code contains the HelloWorld action


  Scenario: active ABBR tag
    Given my source code contains the file "1.md" with content:
      """
      <abbr textrun="HelloWorld">foo</abbr>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: passive ABBR tag
    Given my source code contains the file "1.md" with content:
      """
      <abbr>foo</abbr>
      """
    When running text-run
