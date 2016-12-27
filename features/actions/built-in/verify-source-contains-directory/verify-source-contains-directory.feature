Feature: verifying the source code contains a directory

  As a documentation writer
  I want to be able to point to directories in my source code
  So that my readers can see larger pieces of example code.

  - surround links to a local directory with the "verifyLinkedDirectoryExists" action
    to verify they exist in the source code


  Scenario: linked directory exists
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tr_verifySourceContainsDirectory">
        See the [stuff](stuff) folder for more details
      </a>
      """
    And my workspace contains a directory "stuff"
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                      |
      | LINE     | 1                                         |
      | MESSAGE  | directory stuff exists in the source code |


  Scenario: linked directory does not exists
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tr_verifySourceContainsDirectory">
        [zonk](zonk)
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                             |
      | LINE          | 1                                                |
      | ERROR MESSAGE | directory zonk does not exist in the source code |
      | EXIT CODE     | 1                                                |
