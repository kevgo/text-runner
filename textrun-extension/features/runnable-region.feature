Feature: Execute regions of semantic Markdown

  Scenario: working example
    Given the source code contains a file "1.md" with content:
      """
      <pre type="extension/runnable-region">
      This is a <a type="test">test</a>.
      </pre>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                    | ACTIVITY                        |
      | 1.md     | 1    | extension/runnable-region | execute Markdown in Text-Runner |
      | 1.md     | 2    | test                      | Test                            |

  Scenario: missing content
    Given the source code contains a file "1.md" with content:
      """
      <a type="extension/runnable-region">
      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                    | STATUS | ERROR TYPE | ERROR MESSAGE           |
      | 1.md     | 1    | extension/runnable-region | failed | UserError  | no content to run found |

  Scenario: error in content
    Given the source code contains a file "1.md" with content:
      """
      <a type="extension/runnable-region">
      This will blow up: <a type="zonk"></a>
      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                    | STATUS  | ERROR TYPE | ERROR MESSAGE        |
      | 1.md     | 1    | extension/runnable-region | success |            |                      |
      | 1.md     | 2    | zonk                      | failed  | UserError  | unknown action: zonk |
