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
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME           | LINE | ACTION |
      | standard-prefix.md | 1    | test   |

  Scenario: custom prefix via config file
    Given the source code contains a file "text-run.yml" with content:
      """
      regionMarker: custom
      """
    When running Text-Runner
    Then it prints:
      """
      custom-prefix.md:1 -- Test
      """
    And it doesn't print:
      """
      standard-prefix.md:1 -- Test
      """

  Scenario: custom prefix via API
    When calling:
      """
      command = new textRunner.RunCommand({...config, regionMarker: "custom"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it executes these actions:
      | FILENAME         | LINE | ACTION |
      | custom-prefix.md | 1    | test   |
