@smoke
Feature: finding files in certain directories only

  Background:
    Given a runnable file "readme.md"
    And a runnable file "bar/1.md"
    And a runnable file "foo/1.md"
    And a runnable file "foo/2.md"
    And the configuration file:
      """
      files: '*.md'
      """

  @cli
  Scenario: selecting files via CLI
    When running "text-run foo/*.md"
    Then it runs only the tests in:
      | foo/1.md |
      | foo/2.md |


  @api
  Scenario: selecting files via API
    When calling:
      """
      command = new textRunner.RunCommand({...config, files: 'foo/*.md'})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it executes these actions:
      | FILENAME |
      | foo/1.md |
      | foo/2.md |
