Feature: verifying file content

  As a documentation writer
  I want to be able to write actions that verify created files
  So that I am sure my tools performs the correct actions on the hard drive.


  Background:
    Given my workspace contains the file "02.md" with the content:
      """
      Our workspace contains the file:

      <a class="tr_verifyFileContent">
      __one.txt__

      ```
      Hello world!
      ```

      </a>
      """


  Scenario: file content matches
    Given my workspace contains the file "01.md" with the content:
      """
      <a class="tr_createFile">
      __one.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 02.md                  |
      | LINE     | 3-10                   |
      | MESSAGE  | verifying file one.txt |
    And the test directory still contains a file "one.txt" with content:
      """
      Hello world!
      """


  Scenario: file content mismatch
    Given my workspace contains the file "01.md" with the content:
      """
      <a class="tr_createFile">
      __one.txt__

      ```
      Unexpected content here
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 02.md                                                                                        |
      | LINE          | 3-10                                                                                         |
      | MESSAGE       | verifying file one.txt                                                                       |
      | ERROR MESSAGE | mismatching content in one.txt:\nmismatching records:\n\nHello world!Unexpected content here |
      | EXIT CODE     | 1                                                                                            |
    And the test directory still contains a file "one.txt" with content:
      """
      Unexpected content here
      """


  Scenario: file is missing
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 02.md                  |
      | LINE          | 3-10                   |
      | MESSAGE       | verifying file one.txt |
      | ERROR MESSAGE | file one.txt not found |
      | EXIT CODE     | 1                      |
