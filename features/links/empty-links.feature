Feature: recognize empty links

  As a tutorial writer
  I want to be notified when I forgot to provide the target for a link
  So that I can be sure all links are complete before shipping my tutorial.

  - links without a target cause the test to fail


  Scenario: empty link
    Given my workspace contains the file "1.md" with the content:
      """
      An [empty link to an anchor]()
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                |
      | LINE          | 1                   |
      | ERROR MESSAGE | link without target |
      | EXIT CODE     | 1                   |
