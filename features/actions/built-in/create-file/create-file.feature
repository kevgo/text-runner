Feature: creating files with content

  As a documentation writer
  I want to be able to create files with content
  So that my test suite has files to work with.

  - to create a file, wrap the code in an A tag with class "tr_createFile"
  - the file name is provided in bold
  - content is provided as a triple-fenced code block


  Scenario: running a tutorial that creates files
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tr_createFile">
      creating a file with name __one.txt__ and content:

      ```
      Hello world!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | creator.md            |
      | LINE     | 1-7                   |
      | MESSAGE  | creating file one.txt |
    And the test directory now contains a file "one.txt" with content:
      """
      Hello world!
      """


  Scenario: no file path given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tr_createFile">
      ```
      Hello world!
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                       |
      | LINE          | 1-5                              |
      | MESSAGE       | creating file                    |
      | ERROR MESSAGE | no path given for file to create |
      | EXIT CODE     | 1                                |


  Scenario: no content block given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tr_createFile">
      __one.txt__
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                          |
      | LINE          | 1                                   |
      | MESSAGE       | creating file                       |
      | ERROR MESSAGE | no content given for file to create |
      | EXIT CODE     | 1                                   |


  Scenario: two file paths given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tr_createFile">
      __one.txt__
      __two.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                    |
      | LINE          | 1-8                                           |
      | MESSAGE       | creating file                                 |
      | ERROR MESSAGE | several file paths found: one.txt and two.txt |
      | EXIT CODE     | 1                                             |


  Scenario: two content blocks given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tr_createFile">
      __one.txt__

      ```
      Hello world!
      ```

      ```
      Another world!
      ```

      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                                                |
      | LINE          | 1-12                                                                      |
      | MESSAGE       | creating file                                                             |
      | ERROR MESSAGE | found multiple content blocks for file to create, please provide only one |
      | EXIT CODE     | 1                                                                         |
