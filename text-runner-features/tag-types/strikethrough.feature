Feature: Strikethrough text

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active ABBR tag
    Given the source code contains a file "1.md" with content:
      """
      hello ~~universe~~world
      """
    When running text-run
