Feature: unknown command

  As a user accidentally running a wrong command
  I want to be given a list of valid commands
  So that I know how to use Tutorial Runner correctly.

  - running an unknown command prints the help screen


  Scenario: running an unknown command
    When trying to run the "zonk" command
    Then it signals that "zonk" is an unknown command
