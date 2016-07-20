Feature: creating files with content

  As a tutorial writer
  I want to be able to create files with content
  So that my test suite has files to work with.

  - a

  @verbose
  Scenario: running a tutorial that creates files
    Given I am in a directory containing a file "creator.md" with the content:
      """
      <a class="tutorialRunner_createFileWithContent">
      __one.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When running "tut-run"
    Then it prints:
      """
      creator.md:1 -- creating file one.txt with content:
      Hello world!
      """
    And the test passes
    And the directory now contains a file "one.txt" with content:
      """
      Hello world!
      """


  @verbose
  Scenario: no file path given
    Given I am in a directory containing a file "creator.md" with the content:
      """
      <a class="tutorialRunner_createFileWithContent">
      ```
      Hello world!
      ```
      </a>
      """
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      creator.md:1 -- Error: no path given for file to create
      """
