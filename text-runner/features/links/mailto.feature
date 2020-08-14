@online
Feature: ignoring mailto links

  - links containing a "mailto:foo@acme.com" address are skipped


  Scenario: mailto link
    Given the source code contains the file "1.md" with content:
      """
      A [working external link](mailto:foo@acme.com)
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                  |
      | LINE     | 1                                     |
      | MESSAGE  | skipping: link to mailto:foo@acme.com |
