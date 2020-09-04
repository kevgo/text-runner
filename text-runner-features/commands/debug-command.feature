Feature: display the version

  Scenario: no subcommand
    When trying to run "text-run debug"
    Then it prints this text:
      """
      Please tell me what to debug. I can print these things:

      --activities: active regions
      --ast: AST nodes
      --images: embedded images
      --links: embedded links
      --linkTargets: linkable elements

      Example: text-run debug --images foo.md
      """

  Scenario: subcommand without filename
    When trying to run "text-run debug --ast"
    Then it prints this text:
      """
      Please tell me which file to debug

      Example: text-run debug --ast foo.md
      """

  Scenario: debugging activities
    Given the source code contains a file "1.md" with content:
      """
      <a type="validate-javascript">
      ```
      foo()
      ```
      </a>
      """
    When running "text-run debug --activities 1.md"
    Then it prints:
      """
      AST NODES
      """
