Feature: links to HTML anchors

  As a tutorial writer
  I want to know whether links to other parts of the tutorial work
  So that I can reference releated sections.

  - dead links pointing to other parts of the same page or parts of other pages
    cause the test to fail


  Scenario: link to an existing anchor in the same file
    Given my workspace contains the file "1.md" with the content:
      """
      A [working link to an anchor](#hello)
      text
      <a name="hello">hi</a>
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md           |
      | LINE     | 1              |
      | MESSAGE  | link to #hello |


  Scenario: link to an existing anchor in another file
    Given my workspace contains the file "1.md" with the content:
      """
      A [working link to an anchor](2.md#hello)
      """
    And my workspace contains the file "2.md" with the content:
      """
      <a name="hello">hi</a>
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md               |
      | LINE     | 1                  |
      | MESSAGE  | link to 2.md#hello |


  Scenario: link to a non-existing anchor in the same file
    Given my workspace contains the file "1.md" with the content:
      """
      A [link to non-existing anchor](#zonk)
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                                    |
      | LINE          | 1                                       |
      | ERROR MESSAGE | link to non-existing local anchor #zonk |
      | EXIT CODE     | 1                                       |


  Scenario: link to a non-existing anchor in another file
    Given my workspace contains the file "1.md" with the content:
      """
      A [link to non-existing anchor in other file](2.md#zonk)
      """
    And my workspace contains the file "2.md" with the content:
      """
      <a name="hello">hi</a>
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                                      |
      | LINE          | 1                                         |
      | ERROR MESSAGE | link to non-existing anchor #zonk in 2.md |
      | EXIT CODE     | 1                                         |


  Scenario: link to anchor in non-existing file
    Given my workspace contains the file "1.md" with the content:
      """
      A [link to non-existing anchor in other file](2.md#target)
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                                             |
      | LINE          | 1                                                |
      | ERROR MESSAGE | link to anchor #target in non-existing file 2.md |
      | EXIT CODE     | 1                                                |


  Scenario: link to anchor in file without anchors
    Given my workspace contains the file "1.md" with the content:
      """
      A [link to non-existing anchor in other file](2.md#zonk)
      """
    And my workspace contains the file "2.md" with the content:
      """
      no link targets here
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                                      |
      | LINE          | 1                                         |
      | ERROR MESSAGE | link to non-existing anchor #zonk in 2.md |
      | EXIT CODE     | 1                                         |


  Scenario: link to an existing caption in the same file
    Given my workspace contains the file "1.md" with the content:
      """
      A [working link to an anchor](#hello)
      text
      ## Hello
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md                        |
      | LINE     | 1                           |
      | MESSAGE  | link to local heading Hello |


  Scenario: link to an existing caption in another file
    Given my workspace contains the file "1.md" with the content:
      """
      A [working link to a caption](2.md#hello)
      """
    And my workspace contains the file "2.md" with the content:
      """
      ## Hello
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md                          |
      | LINE     | 1                             |
      | MESSAGE  | link to caption Hello in 2.md |

