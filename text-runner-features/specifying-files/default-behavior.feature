Feature: finding documentation files to run

  Scenario: the current directory contains Markdown files
    Given a runnable file "1.md"
    When calling Text-Runner
    Then it executes 1 test

  Scenario: the Markdown files are located in a subdirectory
    Given a runnable file "foo/1.md"
    When calling Text-Runner
    Then it executes 1 test
