Feature: excluding files

  Background:
    Given a runnable file "readme.md"
    And a runnable file "foo/1.md"
    And a runnable file "bar/2.md"

  @cli
  Scenario: excluding via config file
    Given the configuration file:
      """
      exclude: 'foo'
      """
    When running Text-Runner
    Then it prints:
      """
      bar/2.md:1 -- Test

      readme.md:1 -- Test
      """
    And it doesn't print:
      """
      foo/1.md
      """

  @cli
  Scenario: excluding via CLI
    When running "text-runner --exclude=foo"
    Then it prints:
      """
      bar/2.md:1 -- Test

      readme.md:1 -- Test
      """
    And it doesn't print:
      """
      foo/1.md
      """

  @api
  Scenario: excluding via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, exclude: 'foo'})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME  |
      | bar/2.md  |
      | readme.md |
