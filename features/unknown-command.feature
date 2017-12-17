Feature: unknown command

  As a user accidentally running a wrong command
  I want to be given a list of valid commands
  So that I know how to use TextRunner correctly.

  - running an unknown command prints the help screen


  @apionly
  Scenario: running an unknown command
    When trying to run the "zonk" command
    Then the test fails with:
      | ERROR MESSAGE | unknown command: zonk |
      | EXIT CODE     | 1                                      |
