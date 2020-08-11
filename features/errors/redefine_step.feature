Feature: show error when defining a built-in step

  When creating my own steps
  I want to know whether I accidentally overwrite a built-in step
  So that I don't accidentally change behavior of Text-Runner.

  Scenario: re-defining a built-in step
    Given my source code contains the file "text-run/create-file.js" with content:
      """
      module.exports = function() {}
      """
    And my source code contains the file "1.md" with content:
      """
      <a textrun="createFile">
      __foo__ `bar`
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | redefining internal action 'create-file' |
      | EXIT CODE     | 1                                        |
