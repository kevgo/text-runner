Feature: div tags

  When writing complex div tags in a Markdown document
  I want to be able to make div tags active
  So that I don't have to litter my document with <a> tags

  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: code tag
    Given my source code contains the file "1.md" with content:
      """
      <div textrun="HelloWorld">foo</div>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
