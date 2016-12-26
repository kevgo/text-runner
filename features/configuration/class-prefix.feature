Feature: configuring the class prefix

  As a documentation writer
  I want to be able to be able to define a different prefix for tag classes
  So that I can avoid conflicts with existing CSS classes.

  - the configuration option "classPrefix" allows to provide a custom class prefix


  Scenario: no configuration option
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tr_verifyWorkspaceContainsDirectory">
        `.`
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                   |
      | LINE     | 1                                                      |
      | MESSAGE  | verifying the . directory exists in the test workspace |


  Scenario: configuration option given
    Given the configuration file:
      """
      classPrefix: 'custom_'
      """
    And my workspace contains the file "old.md" with the content:
      """
      <a class="tr_verifyWorkspaceContainsDirectory">
        `.`
      </a>
      """
    And my workspace contains the file "new.md" with the content:
      """
      <a class="custom_verifyWorkspaceContainsDirectory">
        `.`
      </a>
      """
    When running text-run
    Then it runs only the tests in "new.md"
