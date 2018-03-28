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
      | ERROR MESSAGE | Block <a textrun="foo"> is nested in another 'textrun' block |
      | FILENAME      | 1.md                                                         |
      | EXIT CODE     | 1                                                            |
