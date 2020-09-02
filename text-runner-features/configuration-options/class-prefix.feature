Feature: configuring the class prefix

  Background:
    Given the source code contains a file "standard-prefix.md" with content:
      """
      <a type="test">
      standard prefix
      </a>
      """
    And the source code contains a file "custom-prefix.md" with content:
      """
      <a custom="test">
      custom prefix
      </a>
      """

  Scenario: default behavior
    When calling "textRunner.runCommand({sourceDir, formatterName})"
    Then it executes these actions:
      | FILENAME           | LINE | ACTION |
      | standard-prefix.md | 1    | test   |

  Scenario: configuration option given
    Given the source code contains a file "text-run.yml" with content:
      """
      regionMarker: 'custom'
      """
    When calling "textRunner.runCommand({sourceDir, formatterName})"
    Then it executes these actions:
      | FILENAME         | LINE | ACTION |
      | custom-prefix.md | 1    | test   |
