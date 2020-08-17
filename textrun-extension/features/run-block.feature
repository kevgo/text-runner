Feature: Execute blocks of semantic Markdown

  Scenario: working example
    Given the source code contains the file "1.md" with content:
      """
      <a textrun="extension/run-block">
      This is a <a textrun="test">test</a>.
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                            |
      | LINE     | 1                               |
      | MESSAGE  | execute Markdown in Text-Runner |

  Scenario: missing content
    Given the source code contains the file "1.md" with content:
      """
      <a textrun="extension/run-block">
      </a>
      """
    When trying to run text-run
    Then it signals:
      | FILENAME      | 1.md                    |
      | LINE          | 1                       |
      | ERROR MESSAGE | no content to run found |
      | EXIT CODE     | 1                       |
