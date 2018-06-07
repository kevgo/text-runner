Feature: keeping the tmp directory

  When debugging custom actions
  I want to be able to look at the contents of the tmp directory after the test finished
  So that I can verify artifacts created by my actions.

  - if the configuration option "keepTmp" is set, it does not delete the tmp directory


  Background:
    Given my source code contains the file "tr.md" with content:
      """
      <a textrun="create-directory">
      `foo`
      </a>
      """


  Scenario: default behavior
    When running text-run
    Then there is no "tmp" folder


  Scenario: configuration option given
    When running "text-run --keep-tmp"
    Then the test workspace now contains a directory "foo"
