@cli
Feature: display the version

  Scenario: no subcommand
    When trying to run "text-runner debug"
    Then it prints the text:
      """
      Missing or invalid debug subcommand

      Valid debug subcommands are: activities, ast, images, links, linkTargets.
      Please provide the debug subcommands as switches, e.g. "text-runner debug --ast README.md"
      """

  Scenario: subcommand without filename
    When trying to run "text-runner debug --ast"
    Then it prints the text:
      """
      no files specified

      Please tell me which file to debug

      Example: text-runner debug --ast foo.md
      """

  Scenario: debugging activities
    Given the source code contains a file "1.md" with content:
      """
      <a type="test"> </a>
      """
    When running "text-runner debug --activities 1.md"
    Then it prints the text:
      """
      ACTIVITIES:
      1.md:1  test
      """

  Scenario: debugging AST
    Given the source code contains a file "1.md" with content:
      """
      <pre type="validate-javascript">
      foo()
      </pre>
      """
    When running "text-runner debug --ast 1.md"
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
    When running "text-runner debug --images 1.md"
    Then it prints:
      """
      IMAGES:
      {
        actionName: 'check-image',
        location: Location {
          sourceDir: SourceDir {.*},
          file: FullFilePath { value: '1.md' },
          line: 1
        },
        region: NodeList(1) [
          Node {
            type: 'image',
            tag: 'img',
            location: Location {
              sourceDir: SourceDir {.*},
              file: FullFilePath { value: '1.md' },
              line: 1
            },
            content: '',
            attributes: { src: 'watermelon.png' }
          }
        ],
        document: NodeList(0) []
      }
      """

  Scenario: debugging links
    Given the source code contains a file "1.md" with content:
      """
      [another document](2.md)
      """
    When running "text-runner debug --links 1.md"
    Then it prints:
      """
      LINKS:
      {
        actionName: 'check-link',
        location: Location {
          sourceDir: SourceDir {.*},
          file: FullFilePath { value: '1.md' },
          line: 1
        },
        region: NodeList(3) [
          Node {
            type: 'link_open',
            tag: 'a',
            location: Location {
              sourceDir: SourceDir {.*},
              file: FullFilePath { value: '1.md' },
              line: 1
            },
            content: '',
            attributes: { href: '2.md' }
          },
          Node {
            type: 'text',
            tag: '',
            location: Location {
              sourceDir: SourceDir {.*},
              file: FullFilePath { value: '1.md' },
              line: 1
            },
            content: 'another document',
            attributes: {}
          },
          Node {
            type: 'link_close',
            tag: '/a',
            location: Location {
              sourceDir: SourceDir {.*},
              file: FullFilePath { value: '1.md' },
              line: 1
            },
            content: '',
            attributes: {}
          }
        ],
        document: NodeList(0) []
      }
      """

  Scenario: debugging link targets
    Given the source code contains a file "1.md" with content:
      """
      # hello
      """
    When running "text-runner debug --link-targets 1.md"
    Then it prints the text:
      """
      LINK TARGETS:
      1.md [ { name: 'hello', type: 'heading' } ]
      """
