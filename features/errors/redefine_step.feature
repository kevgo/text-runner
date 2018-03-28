Feature: show error when defining a built-in step

  When creating my own steps
  I want to know whether I accidentally overwrite a built-in step
  So that I don't accidentally change behavior.

  Scenario: re-defining a built-in step
    Given my source code contains the file "textrun/create-file.js" with content:
      """
      module.exports = function() {}
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | redefining internal action "createfile" |
      | EXIT CODE     | 1                                       |

