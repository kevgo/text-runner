Feature: selecting formatter via the command-line

  - formatters are instantiated outside of the API, see cli.ts for an example

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a type="test"> </a>
      """

  Scenario: select the formatter via the CLI
    When running "text-run --format=dot"
    Then it runs without errors

  Scenario: select an unknown formatter via the CLI
    When trying to run "text-run --format=zonk"
    Then the call fails with the error:
      """
      Unknown formatter: zonk

      Available formatters are: detailed, dot, progress, silent, summary
      """
