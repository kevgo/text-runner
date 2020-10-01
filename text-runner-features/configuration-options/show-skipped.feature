Feature: show-skipped option

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png">
      [1.md](1.md)
      """

  Scenario: default API setting
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     |
      | 1.md     | 3    | check-link |

  Scenario: default CLI setting
    When running Text-Runner
    Then it prints:
      """
      1.md:3 -- Check link
      """
    And it doesn't print:
      """
      1.md:1 -- Check link
      """
    And it doesn't print:
      """
      1.md:2 -- Check image
      """

  Scenario: enable via CLI
    When running "text-run --show-skipped"
    Then it prints:
      """
      1.md:1 -- Check link
      1.md:2 -- Check image
      1.md:3 -- Check link
      """

  Scenario: enable via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, showSkipped: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTIVITY   |
      | 1.md     | 1    | Check link |
      | 1.md     | 2    | Check link |
      | 1.md     | 3    | Check link |

  Scenario: disable via CLI
    Given the source code contains a file "text-run.yml" with content:
      """
      show-skipped: true
      """
    When running "text-run --no-show-skipped"
    Then it prints:
      """
      1.md:1 -- Check link
      """
    And it doesn't print:
      """
      1.md:1 -- Check link
      """
    And it doesn't print:
      """
      1.md:2 -- Check image
      """
