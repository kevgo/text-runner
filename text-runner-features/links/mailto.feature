@api
@online
Feature: ignoring mailto links

  Scenario: mailto link
    Given the source code contains a file "1.md" with content:
      """
      A [working external link](mailto:foo@acme.com)
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY                    |
      | 1.md     | 1    | check-link | link to mailto:foo@acme.com |
