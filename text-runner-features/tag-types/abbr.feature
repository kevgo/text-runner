Feature: active ABBR tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active ABBR tag
    Given the source code contains a file "1.md" with content:
      """
      <abbr type="HelloWorld">foo</abbr>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
