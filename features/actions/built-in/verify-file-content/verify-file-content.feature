Feature: verifying file content

  As a documentation writer
  I want to be able to write actions that verify created files
  So that I am sure my tools performs the correct actions on the hard drive.

  - the "verifyFileContent" action verifies files in the current workspace
  - the filename is provided as strong text
  - the expected content is provided as a code or fenced block


  Background:
    Given my workspace contains the file "hello.txt" with the content:
      """
      Hello world!
      """


  Scenario: specify file content via a fenced block
    Given my workspace contains the file "01.md" with the content:
      """
      <a class="tr_verifyFileContent">
      __hello.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 01.md                    |
      | LINE     | 1-7                      |
      | MESSAGE  | verifying file hello.txt |


  Scenario: specify file content via a code block
    Given my workspace contains the file "01.md" with the content:
      """
      <a class="tr_verifyFileContent">
      __hello.txt__

      `Hello world!`
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 01.md                    |
      | LINE     | 1-4                      |
      | MESSAGE  | verifying file hello.txt |


  Scenario: file content mismatch
    Given my workspace contains the file "01.md" with the content:
      """
      <a class="tr_verifyFileContent">
      __hello.txt__

      ```
      mismatching expected content
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 01.md                                                                                               |
      | LINE          | 1-7                                                                                                 |
      | MESSAGE       | verifying file hello.txt                                                                            |
      | ERROR MESSAGE | mismatching content in hello.txt:\nmismatching records:\n\nmismatching expected contentHello world! |
      | EXIT CODE     | 1                                                                                                   |


  Scenario: file is missing
    Given my workspace contains the file "01.md" with the content:
      """
      <a class="tr_verifyFileContent">
      __zonk.txt__

      `Hello world!`
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 01.md                   |
      | LINE          | 1-4                     |
      | MESSAGE       | verifying file zonk.txt |
      | ERROR MESSAGE | file zonk.txt not found |
      | EXIT CODE     | 1                       |
