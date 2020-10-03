Feature: creating files with content

  Scenario: providing the filename as emphasized text and the content single-quoted
    Given the source code contains a file "creator.md" with content:
      """
      creating a file with name <a type="workspace/new-file">_one.txt_ and content `Hello world!`</a>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME   | LINE | ACTION             | ACTIVITY            |
      | creator.md | 1    | workspace/new-file | create file one.txt |
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
    When calling Text-Runner
    Then it emits these events:
      | FILENAME   | LINE | ACTION             | ACTIVITY            |
      | creator.md | 1    | workspace/new-file | create file one.txt |
    And the test directory now contains a file "one.txt" with content:
      """
      Hello world!
      """


  Scenario: no file path given
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/new-file">`Hello world!`</a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME   | LINE | ACTION             | STATUS | ERROR TYPE | ERROR MESSAGE                                          |
      | creator.md | 1    | workspace/new-file | failed | UserError  | found no nodes of type 'em/strong/em_open/strong_open' |
    And the error provides the guidance:
      """
      Cannot determine the name of the file to create.
      The node types in this list are: anchor_open, code_open, text, code_close, anchor_close
      """


  Scenario: no content block given
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/new-file">__one.txt__</a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME   | LINE | ACTION             | STATUS | ERROR TYPE | ERROR MESSAGE                                            |
      | creator.md | 1    | workspace/new-file | failed | UserError  | found no nodes of type 'fence/code/fence_open/code_open' |
    And the error provides the guidance:
      """
      Cannot determine the content of the file to create.
      The node types in this list are: anchor_open, strong_open, text, strong_close, anchor_close
      """


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
    When calling Text-Runner
    Then it emits these events:
      | FILENAME   | LINE | ACTION             | STATUS | ERROR TYPE | ERROR MESSAGE                                         |
      | creator.md | 1    | workspace/new-file | failed | UserError  | Found 2 nodes of type 'em/strong/em_open/strong_open' |


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
    When calling Text-Runner
    Then it emits these events:
      | FILENAME   | LINE | ACTION             | STATUS | ERROR TYPE | ERROR MESSAGE                                           |
      | creator.md | 1    | workspace/new-file | failed | UserError  | Found 2 nodes of type 'fence/code/fence_open/code_open' |


  Scenario: setting the base directory
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/new-file" dir="subdir">

      Create a file _one.txt_ with content `Hello world!`

      </a>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME   | LINE | ACTION             | ACTIVITY                   |
      | creator.md | 1    | workspace/new-file | create file subdir/one.txt |
    And the test directory now contains a file "subdir/one.txt" with content:
      """
      Hello world!
      """
