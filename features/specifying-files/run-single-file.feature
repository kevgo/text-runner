Feature: running a single MarkDown file

  As a documentation writer
  I want to be able to test a single MarkDown file
  So that I can check my current changes quickly without having to run the entire test suite.

  - run "text-run run [<file path>]" or "text-run [<file path>]" to test only the given file


  Background:
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="verify-workspace-contains-directory">
      `.`
      </a>
      """
    And my source code contains the file "2.md" with content:
      """
      <a textrun="verify-workspace-contains-directory">
      `.`
      </a>
      """


  Scenario: testing a single file via the complete CLI form
    When running "text-run run 2.md"
    Then it runs only the tests in "2.md"


  Scenario: testing a single file via the short CLI form
    When running "text-run 2.md"
    Then it runs only the tests in "2.md"


  Scenario: testing a non-existing file via the CLI
    When trying to run "text-run zonk.md"
    Then the test fails with:
      | ERROR MESSAGE | file or directory does not exist: zonk.md |
      | EXIT CODE     | 1                                         |
