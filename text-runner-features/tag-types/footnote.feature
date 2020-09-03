Feature: footnotes

  Background:
    Given the source code contains the HelloWorld action

  Scenario: code tag
    Given the source code contains a file "1.md" with content:
      """
      foo[^1]
      <a type="test"> </a>

      [^1]: footnote text
      """
    When calling Text-Runner
