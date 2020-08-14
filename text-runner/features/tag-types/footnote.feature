Feature: footnotes

  When writing documentation
  I want to be able to use and reference footnotes
  So that I don't have to litter my document with peripheral details.


  Background:
    Given the source code contains the HelloWorld action


  Scenario: code tag
    Given the source code contains the file "1.md" with content:
      """
      foo[^1]

      [^1]: footnote text
      """
    When running text-run
