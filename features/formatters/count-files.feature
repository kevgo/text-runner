Feature: Counting files

  When testing documentation
  I want to know how many files have been checked
  So that I know whether all files have been covered.

  - the formatter displays the number of files tested at the end of the test run


  Scenario: a test suite with multiple files
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="validate-javascript">
      ```
      foo()
      ```
      </a>
      """
    And my source code contains the file "2.md" with content:
      """
      <a textrun="validate-javascript">
      ```
      bar()
      ```
      </a>
      """
    When running text-run
    Then it prints:
      """
      2 activities in 2 files
      """

  Scenario: a test suite where some files don't contain active blocks
    Given my source code contains the file "1.md" with content:
      """
      No active block here
      """
    And my source code contains the file "2.md" with content:
      """
      <a textrun="validate-javascript">
      ```
      bar()
      ```
      </a>
      """
    When running text-run
    Then it prints:
      """
      1 activities in 2 files
      """
