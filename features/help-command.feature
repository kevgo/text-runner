Feature: help command

  As a user unsure how to use Tutorial Runner
  I want the application to tell me how to use it
  So that I can use it without having to look this information up elsewhere.

  - run "tut-run help" or "tut-run -h" to see the help page


  @clionly
  Scenario:
    When running the "help" command
    Then I see usage instructions
