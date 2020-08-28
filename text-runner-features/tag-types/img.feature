Feature: active img tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: image tag
    Given the source code contains a file "1.md" with content:
      """
      <img type="HelloWorld" src="watermelon.gif">
      """
    And the workspace contains an image "watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
