Feature: verifying file content

  As a tutorial writer
  I want to be able to write actions that verify created files
  So that I am sure my tools performs the correct actions on the hard drive.


  Background:
    Given my workspace contains the file "file-content-verifier.md" with the content:
      """
      Our workspace contains the file:

      <a class="tutorialRunner_verifyFileContent">
      __one.txt__

      ```
      Hello world!
      ```

      </a>
      """


  Scenario: file content matches
    Given the test directory contains the file "one.txt" with the content:
      """
      Hello world!
      """
    When executing the tutorial
    Then it signals:
      | FILENAME | file-content-verifier.md |
      | LINE     | 3                        |
      | MESSAGE  | verifying file one.txt   |
    And the test passes
    And the test directory still contains a file "one.txt" with content:
      """
      Hello world!
      """


  Scenario: file content mismatch
    Given the test directory contains the file "one.txt" with the content:
      """
      Unexpected content here
      """
    When executing the tutorial
    Then the test fails with:
      | ERROR MESSAGE | mismatching content in one.txt:\nmismatching records:\n\nHello world!Unexpected content here |
      | FILENAME      | file-content-verifier.md                                                                     |
      | LINE          | 3                                                                                            |
      | EXIT CODE     | 1                                                                                            |
    And the test directory still contains a file "one.txt" with content:
      """
      Unexpected content here
      """


  Scenario: file is missing
    When executing the tutorial
    Then the test fails with:
      | ERROR MESSAGE | file one.txt not found   |
      | FILENAME      | file-content-verifier.md |
      | LINE          | 3                        |
      | EXIT CODE     | 1                        |
