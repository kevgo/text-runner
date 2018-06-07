Feature: display the version

  When encountering problems writing active documentation
  I want to see what the parser sees
  So that I can triangulate the issue.


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
      AST NODES
      """
