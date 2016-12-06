@verbose
Feature: verifying that links point to something useful

  As a tutorial writer
  I want to know if links in my documentation point to an actual location
  So that my readers don't get frustrated with dead links.

  - all links targets are verified
  - dead links pointing to local files or directories cause the test to fail
  - dead links pointing to external websites cause a warning


  Scenario: all links work
    Given I am in a directory that contains the "links" example
    When running "tut-run working_links.md"
    Then it signals:
      | FILENAME | working_links.md                  |
      | LINE     | 1                                 |
      | MESSAGE  | checking link to working_links.md |


  Scenario: dead local link


  Scenario: dead external link


