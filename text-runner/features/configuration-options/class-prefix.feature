Feature: configuring the class prefix

  Background:
    Given the source code contains a file "tr.md" with content:
      """
      <a textrun="test">
      standard prefix
      </a>
      """
    And the source code contains a file "custom-prefix.md" with content:
      """
      <a custom="test">
      custom prefix
      </a>
      """


  Scenario: default behavior
    When running text-run
    Then it prints:
      """
      standard prefix
      """
    And it doesn't print:
      """
      custom prefix
      """


  Scenario: configuration option given
    Given the configuration file:
      """
      classPrefix: 'custom'
      """
    When running text-run
    Then it prints:
      """
      custom prefix
      """
    And it doesn't print:
      """
      standard prefix
      """
