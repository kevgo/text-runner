Feature: recognize empty links

  As a documentation writer
  I want to be notified when I forgot to provide the target for a link
  So that I can be sure all links are complete before shipping my documentation.

  - links without a target cause the test to fail


  Scenario Outline: empty link
    Given my source code contains the file "1.md" with content:
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
      | text-run          |
      | "text-run static" |
