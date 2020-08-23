Feature: Execute regions of semantic Markdown

  Scenario: working example
    Given the source code contains a file "1.md" with content:
      """
      <a type="extension/runnable-region">
      This is a <a type="test">test</a>.
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                            |
      | LINE     | 1                               |
      | MESSAGE  | execute Markdown in Text-Runner |

  Scenario: missing content
    Given the source code contains a file "1.md" with content:
      """
      <a type="extension/runnable-region">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                    |
      | LINE          | 1                       |
      | ERROR MESSAGE | no content to run found |
      | EXIT CODE     | 1                       |

  Scenario: error in content
    Given the source code contains a file "1.md" with content:
      """
      <a type="extension/runnable-region">
      This will blow up: <a type="zonk"></a>
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                 |
      | LINE          | 2                    |
      | ERROR MESSAGE | unknown action: zonk |
      | EXIT CODE     | 1                    |
