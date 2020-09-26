@api
Feature: links to HTML anchors

  Scenario: link to an existing anchor in the same file
    Given the source code contains a file "1.md" with content:
      """
      A [working link to an anchor](#hello)
      text
      <a name="hello">hi</a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY       |
      | 1.md     | 1    | check-link | link to #hello |


  Scenario: link to an existing anchor in another file
    Given the source code contains a file "1.md" with content:
      """
      A [working link to an anchor](2.md#hello)
      """
    And the source code contains a file "2.md" with content:
      """
      <a name="hello">hi</a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY           |
      | 1.md     | 1    | check-link | link to 2.md#hello |


  Scenario: link to a non-existing anchor in the same file
    Given the source code contains a file "1.md" with content:
      """
      A [link to non-existing anchor](#zonk)
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY      | STATUS | ERROR TYPE | ERROR MESSAGE                           |
      | 1.md     | 1    | check-link | link to #zonk | failed | UserError  | link to non-existing local anchor #zonk |


  Scenario: link to a non-existing anchor in another file
    Given the source code contains a file "1.md" with content:
      """
      A [link to non-existing anchor in other file](2.md#zonk)
      """
    And the source code contains a file "2.md" with content:
      """
      <a name="hello">hi</a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY          | STATUS | ERROR TYPE | ERROR MESSAGE                             |
      | 1.md     | 1    | check-link | link to 2.md#zonk | failed | UserError  | link to non-existing anchor #zonk in 2.md |


  Scenario: link to anchor in non-existing file
    Given the source code contains a file "1.md" with content:
      """
      A [link to non-existing anchor in other file](2.md#target)
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY            | STATUS | ERROR TYPE | ERROR MESSAGE                                    |
      | 1.md     | 1    | check-link | link to 2.md#target | failed | UserError  | link to anchor #target in non-existing file 2.md |


  Scenario: link to anchor in file without anchors
    Given the source code contains a file "1.md" with content:
      """
      A [link to non-existing anchor in other file](2.md#zonk)
      """
    And the source code contains a file "2.md" with content:
      """
      no link targets here
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY          | STATUS | ERROR TYPE | ERROR MESSAGE                             |
      | 1.md     | 1    | check-link | link to 2.md#zonk | failed | UserError  | link to non-existing anchor #zonk in 2.md |


  Scenario: link to an existing heading in the same file
    Given the source code contains a file "1.md" with content:
      """
      A [working link to an anchor](#hello)
      text
      ## Hello
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY                     |
      | 1.md     | 1    | check-link | link to local heading #hello |


  Scenario: link to an existing heading in another file
    Given the source code contains a file "1.md" with content:
      """
      A [working link to a heading](2.md#hello)
      """
    And the source code contains a file "2.md" with content:
      """
      ## Hello
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY                   |
      | 1.md     | 1    | check-link | link to heading 2.md#hello |


  Scenario: link to heading in PascalCase in another file
    Given the source code contains a file "1.md" with content:
      """
      A [working link to a heading](2.md#github)
      """
    And the source code contains a file "2.md" with content:
      """
      ## GitHub
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY                    |
      | 1.md     | 1    | check-link | link to heading 2.md#github |


  Scenario: link to an existing anchor in a file with URL-encoded spaces
    Given the source code contains a file "1.md" with content:
      """
      A [working link to a heading](foo/bar%20baz.md#hello)
      """
    And the source code contains a file "foo/bar baz.md" with content:
      """
      ## Hello
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY                             |
      | 1.md     | 1    | check-link | link to heading foo/bar baz.md#hello |
