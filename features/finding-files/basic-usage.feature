Feature: finding tutorial files to run

  As a tutorial writer
  I want Tutorial Runner to run all files in my project unless told otherwise
  So that I know my whole tutorial works.

  - by default, it finds all Markdown files in the current directory and all subdirectories
  - when given a directory path as a parameter, it only runs the Markdown files there


  Scenario: the current directory contains Markdown files
    Given a runnable file "creator.md"
    When executing the tutorial
    Then it runs 1 test


  Scenario: the Markdown files are located in a subdirectory
    Given a runnable file "foo/creator.md"
    When executing the tutorial
    Then it runs 1 test
