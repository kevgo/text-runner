Feature: creating files with content

  As a tutorial writer
  I want to be able to create files with content
  So that my test suite has files to work with.

  - to create a file, wrap the code in an A tag with class "tutorialRunner_createFile"
  - the file name is provided in bold
  - content is provided as a triple-fenced code block


  Scenario: running a tutorial that creates files
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createFile">
      __one.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When executing the tutorial
    Then it signals:
      | FILENAME | creator.md            |
      | LINE     | 1-7                   |
      | MESSAGE  | creating file one.txt |
    And the test passes
    And the test directory now contains a file "one.txt" with content:
      """
      Hello world!
      """


  Scenario: no file path given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createFile">
      ```
      Hello world!
      ```
      </a>
      """
    When executing the tutorial
    Then the test fails with:
      | ERROR MESSAGE | no path given for file to create |
      | FILENAME      | creator.md                       |
      | LINE          | 1-5                              |
      | EXIT CODE     | 1                                |


  Scenario: no content block given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createFile">
      __one.txt__
      </a>
      """
    When executing the tutorial
    Then the test fails with:
      | ERROR MESSAGE | no content given for file to create |
      | FILENAME      | creator.md                          |
      | LINE          | 1                                   |
      | EXIT CODE     | 1                                   |


  Scenario: two file paths given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createFile">
      __one.txt__
      __two.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When executing the tutorial
    Then the test fails with:
      | ERROR MESSAGE | several file paths found: one.txt and two.txt |
      | FILENAME      | creator.md                                    |
      | LINE          | 1-8                                           |
      | EXIT CODE     | 1                                             |


  Scenario: two content blocks given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createFile">
      __one.txt__

      ```
      Hello world!
      ```

      ```
      Another world!
      ```

      </a>
      """
    When executing the tutorial
    Then the test fails with:
      | ERROR MESSAGE | found multiple content blocks for file to create, please provide only one |
      | FILENAME      | creator.md                                                             |
      | LINE          | 1-12                                                                   |
      | EXIT CODE     | 1                                                                      |
