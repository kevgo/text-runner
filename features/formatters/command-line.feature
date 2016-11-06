Feature: selecting formatter via the command-line

  As a tutorial writer
  I want to be able to configure TutorialRunner to use different formatters via command-line parameters
  So that I can try different formatters out easily.

  - you can chose a formatter using the `--format <[formatter name]>` command-line parameter
    or the `formatter` key in `tut-run.yml`


  Scenario Outline: selecting formatters via command-line parameter
    Given I am in a directory that contains the "simple" example without a configuration file
    When running tut-run with the "<FORMATTER>" formatter
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
    Given I am in a directory that contains the "simple" example without a configuration file
    When trying to run tut-run with the "zonk" formatter
    Then the call fails with the error:
      """
      Unknown formatter: 'zonk'

      Available formatters are colored, iconic, robust
      """
