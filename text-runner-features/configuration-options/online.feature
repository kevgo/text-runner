@online
Feature: "online" option

  @cli
  Scenario: online option via CLI
    Given the source code contains a file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png">
      """
    When running "text-run --online"
    Then it signals:
      | MESSAGE | link to http://google.com |
    And it signals:
      | MESSAGE | image http://google.com/foo.png |

  @api
  Scenario: default API setting
    Given the source code contains a file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png">
      """
    When calling "textRunner.runCommand({sourceDir, formatterName})"
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                        | STATUS  |
      | 1.md     | 1    | check-link  | link to http://google.com       | skipped |
      | 1.md     | 2    | check-image | image http://google.com/foo.png | skipped |

  @api
  Scenario: online option via API
    Given the source code contains a file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png">
      """
    When calling "textRunner.runCommand({online: true, sourceDir, formatterName})"
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                        | STATUS  |
      | 1.md     | 1    | check-link  | link to http://google.com       | success |
      | 1.md     | 2    | check-image | image http://google.com/foo.png | success |
