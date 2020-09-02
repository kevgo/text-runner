@online
Feature: ignoring mailto links

  Scenario: mailto link
    Given the source code contains a file "1.md" with content:
      """
      A [working external link](mailto:foo@acme.com)
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md                                  |
      | LINE     | 1                                     |
      | MESSAGE  | skipping: link to mailto:foo@acme.com |
