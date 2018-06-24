Feature: XML parser errors

  When mistakenly creating malformatted tables
  I want to be given a meaningful error message
  So that I don't waste time hunting down the error.


  Scenario: wrong closing tag
    Given my source code contains the file "1.md" with content:
      """
      <table>
        <tr></foo>
      </table>
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | Unexpected close tag |
      | FILENAME      | 1.md                 |
      | LINE          | 2                    |
      | EXIT CODE     | 1                    |
