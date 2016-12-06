@clionly
Feature: verifying that links point to something useful

  As a tutorial writer
  I want to know if links in my documentation point to an actual location
  So that my readers don't get frustrated with dead links.

  - all links targets are verified
  - dead links pointing to local files or directories cause the test to fail
  - dead links pointing to external websites cause a warning


  Scenario: all links work
    Given I am in a directory that contains the "links" example
    When running "tut-run working-links.md"
    Then it signals:
      | FILENAME | working-links.md                  |
      | LINE     | 1                                 |
      | MESSAGE  | checking link to working-links.md |


  Scenario: dead local link
    Given I am in a directory that contains the "links" example
    When trying to run "tut-run broken-local-link.md"
    Then the test fails with:
      | FILENAME      | broken-local-link.md                |
      | LINE          | 1                                   |
      | ERROR MESSAGE | link points to non-existing zonk.md |
      | EXIT CODE     | 1                                   |


  Scenario: dead external link
    Given I am in a directory that contains the "links" example
    When running "tut-run broken-external-link.md"
    Then it signals:
      | FILENAME | broken-external-link.md                                     |
      | LINE     | 1                                                           |
      | WARNING  | external website http://natoehunatoeuhaoentuh.com not found |
