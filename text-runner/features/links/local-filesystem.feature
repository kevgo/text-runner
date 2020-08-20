@smoke
Feature: verifying links to the local filesystem

  As a documentation writer
  I want to know whether links to local files in my code base work
  So that I can point my readers to example code that is part of my documentation.

  - links pointing to non-existing local files or directories
    cause the test to fail


  Scenario: relative link to existing local file
    Given the source code contains a file "1.md" with content:
      """
      [link to existing local file](2.md)
      """
    And the source code contains a file "2.md" with content:
      """
      foo
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                    |
      | LINE     | 1                       |
      | MESSAGE  | link to local file 2.md |


  Scenario: relative link to subfolder in subfolder
    Given the source code contains a file "partners/foo/bar.md" with content:
      """
      [link to existing local file](people/readme.md#carsten)
      """
    And the source code contains a file "partners/foo/people/readme.md" with content:
      """
      # Carsten
      """
    When running text-run
    Then it signals:
      | FILENAME | partners/foo/bar.md                                   |
      | LINE     | 1                                                     |
      | MESSAGE  | link to heading partners/foo/people/readme.md#carsten |


  Scenario: absolute link to existing local file
    Given the source code contains a file "docs/1.md" with content:
      """
      [link to existing local file](/docs/1.md)
      """
    When running text-run
    Then it signals:
      | FILENAME | docs/1.md                    |
      | LINE     | 1                            |
      | MESSAGE  | link to local file docs/1.md |



  Scenario: link to existing local directory
    Given the source code contains a file "docs/1.md" with content:
      """
      """
    And the source code contains a file "1.md" with content:
      """
      [link to local directory](docs)
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                         |
      | LINE     | 1                            |
      | MESSAGE  | link to local directory docs |


  Scenario: link to non-existing local file
    Given the source code contains a file "1.md" with content:
      """
      [link to non-existing local file](zonk.md)
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                    |
      | LINE          | 1                                       |
      | ERROR MESSAGE | link to non-existing local file zonk.md |
      | EXIT CODE     | 1                                       |


  Scenario: link to existing local file in higher directory
    Given the source code contains a file "readme.md" with content:
      """
      Hello
      """
    And the source code contains a file "documentation/1.md" with content:
      """
      [link to existing local file](../readme.md)
      """
    When running text-run
    Then it signals:
      | FILENAME | documentation/1.md           |
      | LINE     | 1                            |
      | MESSAGE  | link to local file readme.md |
