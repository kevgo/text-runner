Feature: display the version

  When encountering problems writing active documentation
  I want to see what the parser sees
  So that I can triangulate the issue.


  @clionly
  Scenario: debugging
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="validate-javascript">
      ```
      foo()
      ```
      </a>
      """
    When running "debug"
    Then it prints:
      """
      Active Blocks:
      1.md:1 - anchor-open/validate-javascript
      1.md:5 - anchor-close/validate-javascript
      """
