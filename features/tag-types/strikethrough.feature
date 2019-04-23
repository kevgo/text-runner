Feature: Strikethrough text

  When writing active blocks in a Markdown document
  I want to be able to strike through text
  So that I can visualize intentionally not intended phrasing.


  Background:
    Given my source code contains the HelloWorld action


  Scenario: active ABBR tag
    Given my source code contains the file "1.md" with content:
      """
      hello ~~universe~~world
      """
    When running text-run
