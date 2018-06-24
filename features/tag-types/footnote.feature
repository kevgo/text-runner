Feature: footnotes

  When writing documentation
  I want to be able to use and reference footnotes
  So that I don't have to litter my document with peripheral details.


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: code tag
    Given my source code contains the file "1.md" with content:
      """
      foo[^1]

      [^1]: bar
      """
    When running text-run
