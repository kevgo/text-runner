Feature: configuring the class prefix

  As a documentation writer
  I want to be able to be able to define a different prefix for tag classes
  So that I can avoid conflicts with existing CSS classes.

  - the configuration option "classPrefix" allows to provide a custom class prefix


  Background:
    Given my source code contains the file "tr.md" with content:
      """
      <a textrun="run-javascript">
        ```
        console.log('running block with default class prefix')
        ```
      </a>
      """
    And my source code contains the file "custom-prefix.md" with content:
      """
      <a custom="runJavascript">
        ```
        console.log('running block with custom class prefix')
        ```
      </a>
      """


  Scenario: default behavior
    When running text-run
    Then it prints:
      """
      running block with default class prefix
      """
    And it doesn't print:
      """
      running block with custom class prefix
      """


  Scenario: configuration option given
    Given the configuration file:
      """
      classPrefix: 'custom'
      """
    When running text-run
    Then it prints:
      """
      running block with custom class prefix
      """
    And it doesn't print:
      """
      running block with default class prefix
      """
