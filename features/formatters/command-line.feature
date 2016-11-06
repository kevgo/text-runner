Feature: Formatter types

  As a tutorial writer
  I want to be able to configure TutorialRunner to use different formatters
  So that I can use it with my preferred output format.

  - the default formatter is the "colored" formatter
  - you can chose a formatter using the `--format <[formatter name]>` command-line parameter
    or the `formatter` key in `tut-run.yml`


  Scenario: default formatter
    When executing the "simple" example
    Then it prints:
      """
      ✔ bash.md
      """


  Scenario Outline: formatter types
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
      | icons     | ✔ bash.md   |
