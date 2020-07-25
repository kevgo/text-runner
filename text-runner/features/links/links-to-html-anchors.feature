Feature: links to HTML anchors

  As a documentation writer
  I want to know whether links to other parts of the documentation work
  So that I can reference releated sections.

  - links pointing to non-existing parts of the same page or other pages
    cause the test to fail


  Scenario: link to an existing anchor in the same file
    Given my source code contains the file "1.md" with content:
      """
      A [working link to an anchor](#hello)
      text
      <a name="hello">hi</a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md           |
      | LINE     | 1              |
      | MESSAGE  | link to #hello |


  Scenario: link to an existing anchor in another file
    Given my source code contains the file "1.md" with content:
      """
      A [working link to an anchor](2.md#hello)
      """
    And my source code contains the file "2.md" with content:
      """
      <a name="hello">hi</a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md               |
      | LINE     | 1                  |
      | MESSAGE  | link to 2.md#hello |


  Scenario: link to a non-existing anchor in the same file
    Given my source code contains the file "1.md" with content:
      """
      A [link to non-existing anchor](#zonk)
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                    |
      | LINE          | 1                                       |
      | ERROR MESSAGE | link to non-existing local anchor #zonk |
      | EXIT CODE     | 1                                       |


  Scenario: link to a non-existing anchor in another file
    Given my source code contains the file "1.md" with content:
      """
      A [link to non-existing anchor in other file](2.md#zonk)
      """
    And my source code contains the file "2.md" with content:
      """
      <a name="hello">hi</a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                      |
      | LINE          | 1                                         |
      | ERROR MESSAGE | link to non-existing anchor #zonk in 2.md |
      | EXIT CODE     | 1                                         |


  Scenario: link to anchor in non-existing file
    Given my source code contains the file "1.md" with content:
      """
      A [link to non-existing anchor in other file](2.md#target)
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                             |
      | LINE          | 1                                                |
      | ERROR MESSAGE | link to anchor #target in non-existing file 2.md |
      | EXIT CODE     | 1                                                |


  Scenario: link to anchor in file without anchors
    Given my source code contains the file "1.md" with content:
      """
      A [link to non-existing anchor in other file](2.md#zonk)
      """
    And my source code contains the file "2.md" with content:
      """
      no link targets here
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                      |
      | LINE          | 1                                         |
      | ERROR MESSAGE | link to non-existing anchor #zonk in 2.md |
      | EXIT CODE     | 1                                         |


  Scenario: link to an existing heading in the same file
    Given my source code contains the file "1.md" with content:
      """
      A [working link to an anchor](#hello)
      text
      ## Hello
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                         |
      | LINE     | 1                            |
      | MESSAGE  | link to local heading #hello |


  Scenario: link to an existing heading in another file
    Given my source code contains the file "1.md" with content:
      """
      A [working link to a heading](2.md#hello)
      """
    And my source code contains the file "2.md" with content:
      """
      ## Hello
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                       |
      | LINE     | 1                          |
      | MESSAGE  | link to heading 2.md#hello |


  Scenario: link to heading in PascalCase in another file
    Given my source code contains the file "1.md" with content:
      """
      A [working link to a heading](2.md#github)
      """
    And my source code contains the file "2.md" with content:
      """
      ## GitHub
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                        |
      | LINE     | 1                           |
      | MESSAGE  | link to heading 2.md#github |


  Scenario: link to an existing anchor in a file with URL-encoded spaces
    Given my source code contains the file "1.md" with content:
      """
      A [working link to a heading](foo/bar%20baz.md#hello)
      """
    And my source code contains the file "foo/bar baz.md" with content:
      """
      ## Hello
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                   |
      | LINE     | 1                                      |
      | MESSAGE  | link to heading foo/bar baz.md#hello |

