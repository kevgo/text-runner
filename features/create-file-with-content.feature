Feature: creating files with content

  As a tutorial writer
  I want to be able to create files with content
  So that my test suite has files to work with.

  - a

  @verbose @debug
  Scenario: running a tutorial that creates files
    Given I am in the directory of the tutorial "create-files"
    When running "tut-run"
    Then it prints:
      """
      creating file one.txt with content
      Hello world!
      """
    And the test passes
