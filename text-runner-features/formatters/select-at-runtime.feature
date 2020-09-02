Feature: selecting formatter via the command-line

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a type="test">
      </a>
      """

  Scenario: selecting the formatter via CLI
    When running "text-run --format dot"
    Then it runs without errors

  Scenario: selecting the formatters via API
    When calling "textRunner.runCommand({formatterName: 'silent', sourceDir})"
    Then it runs without errors

  Scenario: selecting an unknown formatter via CLI
    When trying to run "text-run --format zonk"
    Then the call fails with the error:
      """
      Unknown formatter: zonk

      Available formatters are: detailed, dot, progress, silent, summary
      """

  Scenario: selecting an unknown formatter via API
    When trying to call "textRunner.runCommand({formatterName: 'zonk', sourceDir})"
    Then it throws:
      | ERROR TYPE | ERROR MESSAGE           |
      | UserError  | Unknown formatter: zonk |
    And the exception provides the guidance:
      """
      Available formatters are: detailed, dot, progress, silent, summary
      """
