Feature: finding documentation files to run

  As a documentation writer
  I want TextRunner to run all files in my project unless told otherwise
  So that I know my whole documentation works.

  - by default, it finds all Markdown files in the current directory and all subdirectories
  - when given a directory path as a parameter, it only runs the Markdown files there


  Scenario: the current directory contains Markdown files
    Given a runnable file "creator.md"
    When running text-run
    Then it runs 1 test


  Scenario: the Markdown files are located in a subdirectory
    Given a runnable file "foo/creator.md"
    When running text-run
    Then it runs 1 test
