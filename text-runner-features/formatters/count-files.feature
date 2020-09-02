Feature: Counting files

  Scenario: a test suite with multiple files
    Given the source code contains a file "1.md" with content:
      """
      <a type="test">
      </a>
      """
    And the source code contains a file "2.md" with content:
      """
      <a type="test">
      </a>
      """
    When running Text-Runner
    Then it prints:
      """
      2 activities in 2 files
      """

  Scenario: a test suite where some files don't contain active regions
    Given the source code contains a file "1.md" with content:
      """
      No active region here
      """
    And the source code contains a file "2.md" with content:
      """
      <a type="test">
      </a>
      """
    When running Text-Runner
    Then it prints:
      """
      1 activities in 2 files
      """
