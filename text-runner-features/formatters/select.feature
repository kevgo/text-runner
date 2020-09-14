Feature: selecting formatter via the config file

  - formatters are instantiated outside of the API, see cli.ts for an example

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a type="test"> </a>
      <a type="test"> </a>
      """

  Scenario: select the formatter via CLI
    When running "text-run --format=dot"
    Then it runs without errors

  Scenario: select an unknown formatter via CLI
    When trying to run "text-run --format=zonk"
    Then the call fails with the error:
      """
      Unknown formatter: zonk

      Available formatters are: detailed, dot, progress, silent, summary
      """

  Scenario Outline: select the formatter via config file
    Given the configuration file:
      """
      format: <FORMATTER>
      """
    When running Text-Runner
    Then it prints:
      """
      <OUTPUT>
      """

    Examples:
      | FORMATTER | OUTPUT   |
      | detailed  | Test     |
      | dot       | \.\.     |
      | progress  | Success! |
      | summary   | Success! |


  Scenario: the config file specifies an unknown formatter
    Given my workspace contains testable documentation
    And the configuration file:
      """
      format: zonk
      """
    When trying to run Text-Runner
    Then the call fails with the error:
      """
      Unknown formatter: zonk

      Available formatters are: detailed, dot
      """
