Feature: handle nested "textrun" block

  When mistakenly creating nested "textrun" blocks
  I want to be given a meaningful error message
  So that I don't waste time hunting down the error.


  Scenario: nested "textrun" block
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="validate-javascript">

      <a textrun="foo">
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | this active block is nested inside another active block of type validate-javascript on line 1 |
      | FILENAME      | 1.md                                                                                              |
      | LINE          | 3                                                                                                 |
      | EXIT CODE     | 1                                                                                                 |
