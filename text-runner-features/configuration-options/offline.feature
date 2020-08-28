Feature: "offline" option

  Scenario: offline option
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
