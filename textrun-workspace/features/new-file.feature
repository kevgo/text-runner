Feature: creating files with content

  Scenario: providing the filename as emphasized text and the content single-quoted
    Given the source code contains a file "creator.md" with content:
      """
      creating a file with name <a type="workspace/new-file">_one.txt_ and content `Hello world!`</a>.
      """
    When running text-run
    Then it signals:
      | FILENAME | creator.md          |
      | LINE     | 1                   |
      | MESSAGE  | create file one.txt |
    And the test directory now contains a file "one.txt" with content:
      """
      Hello world!
      """

  Scenario: providing the filename as bold text and the content triple-quoted
    Given the source code contains a file "creator.md" with content:
      """
      creating a file with name <a type="workspace/new-file">__one.txt__ and content:

      ```
      Hello world!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | creator.md          |
      | LINE     | 1                   |
      | MESSAGE  | create file one.txt |
    And the test directory now contains a file "one.txt" with content:
      """
      Hello world!
      """

  Scenario: no file path given
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/new-file">`Hello world!`</a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                             |
      | LINE          | 1                                                      |
      | ERROR MESSAGE | Found no nodes of type 'em/strong/em_open/strong_open' |
      | EXIT CODE     | 1                                                      |

  Scenario: no content block given
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/new-file">__one.txt__</a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                               |
      | LINE          | 1                                                        |
      | ERROR MESSAGE | Found no nodes of type 'fence/code/fence_open/code_open' |
      | EXIT CODE     | 1                                                        |

  Scenario: two file paths given
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/new-file">

      __one.txt__
      __two.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                            |
      | LINE          | 1                                                     |
      | ERROR MESSAGE | Found 2 nodes of type 'em/strong/em_open/strong_open' |
      | EXIT CODE     | 1                                                     |

  Scenario: two content blocks given
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/new-file">

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
      | FILENAME      | creator.md                                             |
      | LINE          | 1                                                      |
      | ERROR MESSAGE | Found 2 nodes of type 'fence/code/fence_open/code_open |
      | EXIT CODE     | 1                                                      |
