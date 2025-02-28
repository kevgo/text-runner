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
      1.md:3 -- link to local file 1.md
      """
    And it doesn't print:
      """
      1.md:1
      """
    And it doesn't print:
      """
      1.md:2
      """

  Scenario: enable via CLI
    When running "text-runner --show-skipped"
    Then it prints:
      """
      1.md:1 -- skipping: link to http://google.com
      1.md:2 -- skipping: image http://google.com/foo.png
      1.md:3 -- link to local file 1.md
      """

  Scenario: enable via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, showSkipped: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTIVITY                        | STATUS  |
      | 1.md     | 1    | link to http://google.com       | skipped |
      | 1.md     | 2    | image http://google.com/foo.png | skipped |
      | 1.md     | 3    | link to local file 1.md         | success |

  Scenario: disable via CLI
    Given the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "show-skipped": true
      }
      """
    When running "text-runner --no-show-skipped"
    Then it prints:
      """
      1.md:3 -- link to local file 1.md
      """
    And it doesn't print:
      """
      1.md:1 -- Check link
      """
    And it doesn't print:
      """
      1.md:2 -- Check image
      """
