@clionly
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
    When running "tut-run 1.md"
    Then it signals:
      | FILENAME | 1.md               |
      | LINE     | 1                  |
      | WARNING  | link to 1.md#hello |


  Scenario: link to an existing anchor in another file


  Scenario: link to a non-existing anchor in the same file


  Scenario: link to a non-existing anchor in another file
