Feature: recognize empty links

  Scenario Outline: empty link
    Given the source code contains a file "1.md" with content:
      """
      An [empty link to an anchor]()
      """
    When trying to run <COMMAND>
    Then the test fails with:
      | FILENAME      | 1.md                |
      | LINE          | 1                   |
      | ERROR MESSAGE | link without target |
      | EXIT CODE     | 1                   |

    Examples:
      | COMMAND           |
      | Text-Runner       |
      | "text-run static" |
