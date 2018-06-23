Feature: HR tags

  When writing active blocks in a Markdown document
  I want to be able to make HR tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: active HR tag
    Given my source code contains the file "1.md" with content:
      """
      <hr textrun="HelloWorld">
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: inactive HR tag
    Given my source code contains the file "1.md" with content:
      """
      <hr>
      """
    When running text-run

  Scenario: inactive HR Markdown tag
    Given my source code contains the file "1.md" with content:
      """
      ---
      """
    When running text-run
