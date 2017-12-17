Feature: unknown command

  As a user accidentally running a wrong command
  I want to be given a list of valid commands
  So that I know how to use TextRunner correctly.

  - running an unknown command prints the help screen


  @apionly
  Scenario: running an unknown command via the API
    When trying to run the "zonk" command
    Then the test fails with:
      | ERROR MESSAGE | unknown command: zonk |
      | EXIT CODE     | 1                                      |


  @clionly
  Scenario: running an unknown command via the CLI
    When trying to run "text-run zonk"
    Then the test fails with:
      | ERROR MESSAGE | file or directory does not exist: zonk |
      | EXIT CODE     | 1                                      |
