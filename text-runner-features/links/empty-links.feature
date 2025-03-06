@api
Feature: recognize empty links

  Scenario: empty link
    Given the source code contains a file "1.md" with content:
      """
      An [empty link to an anchor]()
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY   | STATUS | ERROR TYPE | ERROR MESSAGE       |
      | 1.md     | 1    | check-link | Check link | failed | UserError  | link without target |
