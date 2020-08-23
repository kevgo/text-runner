@smoke
Feature: keeping the tmp directory

  Background:
    Given the source code contains a file "tr.md" with content:
      """
      <a type="workspace/create-directory">

      `foo`
      </a>
      """


  Scenario: default behavior
    When running text-run
    Then there is no "tmp" folder


  Scenario: configuration option given
    When running "text-run --keep-workspace"
    Then the test workspace now contains a directory "foo"
