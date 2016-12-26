@clionly
Feature: selecting formatter via the command-line

  As a documentation writer
  I want to be able to configure TextRunner to use different formatters via command-line parameters
  So that I can try different formatters out easily.

  - you can chose a formatter using the `--format <[formatter name]>` command-line parameter
    or the `formatter` key in `text-run.yml`


  Background:
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="textRunner_runConsoleCommand">
      ```
      echo "Hello world"
      ```
      </a>
      """


  Scenario Outline: selecting formatters via command-line parameter
    When running text-run with the "<FORMATTER>" formatter
    Then it prints:
      """
      <OUTPUT>
      """

    Examples:
      | FORMATTER | OUTPUT      |
      | robust    | Hello world |
      | colored   | 1.md        |
      | iconic    | 1.md        |


  Scenario: selecting an unknown formatter
    When trying to run text-run with the "zonk" formatter
    Then the call fails with the error:
      """
      Unknown formatter: 'zonk'

      Available formatters are colored, iconic, robust
      """
