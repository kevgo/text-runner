Feature: Formatters

  As a tutorial writer
  I want to be able to configure TutorialRunner to use different formatters
  So that I can use it with my preferred output format.

  - the default formatter is the "colored" formatter
  - you can chose a different formatter using the `--format <[formatter name]>` command-line parameter
    or the `formatter` key in `tut-run.yml`


  Background:
    Given I am in a directory that contains the "simple" example without a configuration file


  Scenario: default formatter
    When running tut-run
    Then it prints:
      """
      ✔ bash.md
      """


  Scenario: robust formatter
    When running tut-run with the "robust" formatter
    Then it prints:
      """
      Hello world
      """


  Scenario: colored formatter
    When running tut-run with the "colored" formatter
    Then it prints:
      """
      bash.md
      """


  Scenario: icons formatter
    When running tut-run with the "icons" formatter
    Then it prints:
      """
      ✔ bash.md
      """
