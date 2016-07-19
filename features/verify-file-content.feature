Feature: verifying file content

  As a tutorial writer
  I want to be able to write actions that verify created files
  So that I am sure my tools performs the correct actions on the hard drive.


  @verbose @debug
  Scenario: file content matches
    Given I am in a directory containing a file "file-content-verifier.md" with the content:
      """
      Our workspace contains the file:

      <a class="tutorialRunner_verifyFileContent">
      __one.txt__

      ```
      Hello world!
      ```

      </a>
      """
    When running "tut-run"
    Then it prints:
      """
      file-content-verifier.md:3 -- verifying file one.txt
      """
    And the test passes
    And the directory still contains a file "one.txt" with content:
      """
      Hello world!
      """



  Scenario: file content mismatch


  Scenario: file is missing
