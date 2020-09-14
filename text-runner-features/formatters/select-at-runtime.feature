Feature: selecting formatter via the command-line

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a type="test">
      </a>
      """

  Scenario: select the formatter via the CLI
    When running "text-run --format=dot"
    Then it runs without errors

  Scenario: select the formatter via the API
    When calling "textRunner.runCommand({formatterName: 'silent', sourceDir})"
    Then it runs without errors

  Scenario: select an unknown formatter via the CLI
    When trying to run "text-run --format=zonk"
    Then the call fails with the error:
      """
      Unknown formatter: zonk

      Available formatters are: detailed, dot, progress, silent, summary
      """

  Scenario: select an unknown formatter via the API
    When trying to call "textRunner.runCommand({formatterName: 'zonk', sourceDir})"
    Then it throws:
      | ERROR TYPE | ERROR MESSAGE           |
      | UserError  | Unknown formatter: zonk |
    And the API exception provides the guidance:
      """
      Available formatters are: detailed, dot, progress, silent, summary
      """
