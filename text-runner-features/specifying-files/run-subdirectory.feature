Feature: testing all docs in a subfolder

  Background:
    Given a runnable file "commands/foo.md"
    Given a runnable file "commands/bar/baz.md"
    And a runnable file "readme.md"

  @cli
  Scenario: testing all files in a subfolder via CLI
    When running "text-runner commands"
    Then it runs only the tests in:
      | commands/foo.md     |
      | commands/bar/baz.md |

  @api
  Scenario: testing all files in a subfolder via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, files: 'commands'})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it runs these actions:
      | FILENAME            |
      | commands/bar/baz.md |
      | commands/foo.md     |
