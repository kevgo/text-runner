Feature: display the version

  Scenario: debugging
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="validate-javascript">
      ```
      foo()
      ```
      </a>
      """
    When running "text-run debug"
    Then it prints:
      """
      AST NODES
      """
