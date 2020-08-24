Feature: selecting formatter via the config file

  Scenario Outline: formatter types in config file
    Given my workspace contains testable documentation
    And the configuration file:
      """
      format: <FORMATTER>
      """
    When running text-run
    Then it prints:
      """
      <OUTPUT>
      """

    Examples:
      | FORMATTER | OUTPUT                 |
      | detailed  | testable documentation |
      | dot       | .                      |
      | progress  | Success                |
      | silent    |                        |
      | summary   | Success                |


  Scenario: the config file specifies an unknown formatter
    Given my workspace contains testable documentation
    And the configuration file:
      """
      format: zonk
      """
    When trying to run text-run
    Then the call fails with the error:
      """
      Unknown formatter: zonk

      Available formatters are: detailed, dot
      """
