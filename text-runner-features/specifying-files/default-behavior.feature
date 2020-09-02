Feature: finding documentation files to run

  Scenario: the current directory contains Markdown files
    Given a runnable file "creator.md"
    When running Text-Runner
    Then it runs 1 test

  Scenario: the Markdown files are located in a subdirectory
    Given a runnable file "foo/creator.md"
    When running Text-Runner
    Then it runs 1 test
