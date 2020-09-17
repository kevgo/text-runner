@api
Feature: active h5 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H5 tag
    Given the source code contains a file "1.md" with content:
      """
      <h5 type="HelloWorld">hello</h5>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
