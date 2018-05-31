Feature: verifying the source code contains a directory

  As a documentation writer
  I want to be able to point to directories in my source code
  So that my readers can see larger pieces of example code.

  - surround links to a local directory with the "verifyLinkedDirectoryExists" action
    to verify they exist in the source code


  Scenario: directory exists
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="verify-source-contains-directory">
        See the `stuff` folder for more details
      </a>
      """
    And my source code contains the directory "stuff"
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                      |
      | LINE     | 1                                         |
      | MESSAGE  | directory stuff exists in the source code |


  Scenario: directory does not exist
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="verify-source-contains-directory">
        `zonk`
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                             |
      | LINE          | 1                                                |
      | ERROR MESSAGE | directory zonk does not exist in the source code |
      | EXIT CODE     | 1                                                |


  Scenario: element is not a directory
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="verify-source-contains-directory">
        `README.md`
      </a>
      """
    And my source code contains the file "README.md"
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                       |
      | LINE          | 1                                                          |
      | ERROR MESSAGE | README.md exists in the source code but is not a directory |
      | EXIT CODE     | 1                                                          |
