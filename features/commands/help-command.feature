Feature: help command

  As a user unsure how to use TextRunner
  I want the application to tell me how to use it
  So that I can use it without having to look this information up elsewhere.

  - run "text-run help" or "text-run -h" to see the help page


  Scenario:
    When running the "help" command
    Then I see usage instructions
