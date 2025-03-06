Feature: running a single MarkDown file

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a type="test"></a>.
      """
    And the source code contains a file "2.md" with content:
      """
      <a type="test"></a>.
      """

  @cli
  Scenario: testing a single file via the complete CLI form
    When running "text-runner run 2.md"
    Then it runs only the tests in "2.md"

  @cli
  Scenario: testing a single file via the short CLI form
    When running "text-runner 2.md"
    Then it runs only the tests in "2.md"

  @cli
  Scenario: testing a non-existing file via the CLI
    When trying to run "text-runner zonk.md"
    Then the test fails with:
      | ERROR MESSAGE | file or directory does not exist: zonk.md |
      | EXIT CODE     | 1                                         |

  @api
  Scenario: testing a single file via the API
    When calling:
      """
      command = new textRunner.commands.Run({...config, files: '2.md'})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it runs these actions:
      | FILENAME |
      | 2.md     |
