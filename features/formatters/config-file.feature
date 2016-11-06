Feature: selecting formatter via the config file

  As a tutorial writer
  I want to be able to configure which formatter TutorialRunner uses via the config file
  So that I can use my preferred output format all the time.

  - you can chose a formatter using the `formatter` key in `tut-run.yml`


  Scenario Outline: formatter types in config file
    Given I am in a directory that contains the "simple" example with the configuration file:
      """
      formatter: <FORMATTER>
      """
    When running tut-run
    Then it prints:
      """
      <OUTPUT>
      """

    Examples:
      | FORMATTER | OUTPUT      |
      | robust    | Hello world |
      | colored   | bash.md     |
      | iconic    | ✔ bash.md   |


  Scenario: selecting an unknown formatter
    Given I am in a directory that contains the "simple" example with the configuration file:
      """
      formatter: zonk
      """
    When trying to run tut-run
    Then the test fails with:
      | ERROR MESSAGE | Unknown formatter: 'zonk' |
      | EXIT CODE     | 1                         |
