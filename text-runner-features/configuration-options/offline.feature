Feature: "offline" option

  Scenario: offline option via CLI
    Given the source code contains a file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png">
      """
    When running "text-run --offline"
    Then it signals:
      | MESSAGE | skipping: link to http://google.com |
    And it signals:
      | MESSAGE | skipping: image http://google.com/foo.png |


  Scenario: offline option via API
    Given the source code contains a file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png">
      """
    When calling "textRunner.runCommand({offline: true, sourceDir, formatterName})"
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | check-link  |
      | 1.md     | 2    | check-image |
