Feature: selecting formatter via the command-line

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="test">
      </a>
      """

  Scenario Outline: selecting formatters via command-line parameter
    When running "text-run --format <FORMATTER>"
    Then it runs without errors

    Examples:
      | FORMATTER |
      | detailed  |
      | dot       |
      | progress  |
      | summary   |

  Scenario: selecting an unknown formatter via the command line
    When trying to run "text-run --format zonk"
    Then the call fails with the error:
      """
      Unknown formatter: zonk

      Available formatters are: detailed, dot, progress, summary
      """
