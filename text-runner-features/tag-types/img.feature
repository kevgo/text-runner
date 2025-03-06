@api
Feature: active img tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: image tag
    Given the source code contains a file "1.md" with content:
      """
      <img type="HelloWorld" src="watermelon.gif">
      """
    And the workspace contains an image "watermelon.gif"
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
      | 1.md     | 1    | check-image |
