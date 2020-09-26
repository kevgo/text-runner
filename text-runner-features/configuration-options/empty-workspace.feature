Feature: empty the workspace

  Background:
    Given the workspace contains a file "1.md" with content:
      """
      <a type="test"> </a>
      """

  @api
  Scenario: default API behavior
    When calling Text-Runner
    Then it emits these events:
      | STATUS  | MESSAGE                 |
      | warning | no Markdown files found |

  @cli
  Scenario: default CLI behavior
    When running Text-Runner
    Then it prints:
      """
      no Markdown files found
      """

  @cli
  Scenario: disable via config file
    Given the text-run configuration contains:
      """
      emptyWorkspace: false
      """
    When running Text-Runner
    Then it prints:
      """
      foo
      """
