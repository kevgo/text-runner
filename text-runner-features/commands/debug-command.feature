@debug
Feature: display the version

  Scenario: no subcommand
    When trying to call "textRunner.debugCommand({})"
    Then it throws:
      | ERROR TYPE | ERROR MESSAGE     |
      | UserError  | missing data type |
    And the API exception provides the guidance:
      """
      Please tell me what to debug. I can print these things:

      --activities: active regions
      --ast: AST nodes
      --images: embedded images
      --links: embedded links
      --link-targets: document anchors to link to

      Example: text-run debug --images foo.md
      """

  Scenario: subcommand without filename
    When trying to run "text-run debug --ast"
    Then it prints the text:
      """
      no files specified

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
    Then it prints the text:
      """
      ACTIVITIES:
      1.md:1  validate-javascript
      """

  Scenario: debugging AST
    Given the source code contains a file "1.md" with content:
      """
      <pre type="validate-javascript">
      foo()
      </pre>
      """
    When running "text-run debug --ast 1.md"
    Then it prints the text:
      """
      AST NODES:
      1.md:1  fence_open (validate-javascript)
      1.md:2  text ("foo()")
      1.md:3  fence_close
      """

  Scenario: debugging images
    Given the source code contains a file "1.md" with content:
      """
      <img src="watermelon.png">
      """
    When running "text-run debug --images 1.md"
    Then it prints the text:
      """
      IMAGES:
      {
        actionName: 'check-image',
        file: AbsoluteFilePath { value: '1.md' },
        line: 1,
        region: AstNodeList(1) [
          AstNode {
            type: 'image',
            tag: 'img',
            file: AbsoluteFilePath { value: '1.md' },
            line: 1,
            content: '',
            attributes: { src: 'watermelon.png' }
          }
        ],
        document: AstNodeList(0) []
      }
      """

  Scenario: debugging links
    Given the source code contains a file "1.md" with content:
      """
      [another document](2.md)
      """
    When running "text-run debug --links 1.md"
    Then it prints the text:
      """
      LINKS:
      {
        actionName: 'check-link',
        file: AbsoluteFilePath { value: '1.md' },
        line: 1,
        region: AstNodeList(3) [
          AstNode {
            type: 'link_open',
            tag: 'a',
            file: AbsoluteFilePath { value: '1.md' },
            line: 1,
            content: '',
            attributes: { href: '2.md' }
          },
          AstNode {
            type: 'text',
            tag: '',
            file: AbsoluteFilePath { value: '1.md' },
            line: 1,
            content: 'another document',
            attributes: {}
          },
          AstNode {
            type: 'link_close',
            tag: '/a',
            file: AbsoluteFilePath { value: '1.md' },
            line: 1,
            content: '',
            attributes: {}
          }
        ],
        document: AstNodeList(0) []
      }
      """

  Scenario: debugging link targets
    Given the source code contains a file "1.md" with content:
      """
      # hello
      """
    When running "text-run debug --link-targets 1.md"
    Then it prints the text:
      """
      LINK TARGETS:
      1.md [ { name: 'hello', type: 'heading' } ]
      """
