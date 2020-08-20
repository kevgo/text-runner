Feature: active h2 tags

    When writing active blocks in a Markdown document
  I want to be able to make h2 tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given the source code contains the HelloWorld action


  Scenario: H2 tag
    Given the source code contains a file "1.md" with content:
      """
      <h2 textrun="HelloWorld">hello</h2>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
