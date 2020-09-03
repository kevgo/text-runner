@smoke
Feature: verifying links to the local filesystem

  Scenario: relative link to existing local file
    Given the source code contains a file "1.md" with content:
      """
      [link to existing local file](2.md)
      """
    And the source code contains a file "2.md" with content:
      """
      foo
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY                |
      | 1.md     | 1    | check-link | link to local file 2.md |


  Scenario: relative link to subfolder in subfolder
    Given the source code contains a file "partners/foo/bar.md" with content:
      """
      [link to existing local file](people/readme.md#carsten)
      """
    And the source code contains a file "partners/foo/people/readme.md" with content:
      """
      # Carsten
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME            | LINE | ACTION     | ACTIVITY                                              |
      | partners/foo/bar.md | 1    | check-link | link to heading partners/foo/people/readme.md#carsten |


  Scenario: absolute link to existing local file
    Given the source code contains a file "docs/1.md" with content:
      """
      [link to existing local file](/docs/1.md)
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME  | LINE | ACTION     | ACTIVITY                     |
      | docs/1.md | 1    | check-link | link to local file docs/1.md |


  Scenario: link to existing local directory
    Given the source code contains a file "docs/1.md" with content:
      """
      """
    And the source code contains a file "1.md" with content:
      """
      [link to local directory](docs)
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY                     |
      | 1.md     | 1    | check-link | link to local directory docs |


  Scenario: link to non-existing local file
    Given the source code contains a file "1.md" with content:
      """
      [link to non-existing local file](zonk.md)
      """
    When trying to call Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY                   | STATUS | ERROR TYPE | ERROR MESSAGE                           |
      | 1.md     | 1    | check-link | link to local file zonk.md | failed | UserError  | link to non-existing local file zonk.md |


  Scenario: link to existing local file in higher directory
    Given the source code contains a file "readme.md" with content:
      """
      Hello
      """
    And the source code contains a file "documentation/1.md" with content:
      """
      [link to existing local file](../readme.md)
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME           | LINE | ACTION     | ACTIVITY                     |
      | documentation/1.md | 1    | check-link | link to local file readme.md |
