Feature: ignore link patterns

  @cli
  Scenario: regex given
    Given the source code contains a file "text-run.yml" with content:
      """
      ignoreLinks:
        - "\\(\\$.*\\)"
      """
    Given the source code contains a file "1.md" with content:
      """
      a [placeholder link]($PLACEHOLDER)
      a [normal link](text-run.yml)
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     |
      | 1.md     | 2    | check-link |
