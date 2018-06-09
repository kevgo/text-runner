Feature: active h1 tags

  When writing active blocks in a Markdown document
  I want to be able to make h1 tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: H1 tag
    Given my source code contains the file "1.md" with content:
      """
      <h1 textrun="HelloWorld">hello</h1>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
