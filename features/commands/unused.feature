Feature: show unused steps

  When refactoring steps
  I want to see which steps are no longer used
  So that I can remove them.


  Scenario: the code base contains unused steps
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="validate-javascript">
      ```
      foo()
      ```
      </a>
      """
    And my source code contains the file "text-run/unused.js" with content:
      """
      module.exports = function () {}
      """
    When running "text-run unused"
    Then it prints:
      """
      Unused actions:
      - unused
      """
