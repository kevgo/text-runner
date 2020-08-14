Feature: "offline" option

  When running offline
  I want to skip checks of remote links
  So that my test runs.

  - when the option "--offline" is given, TextRunner skips checking remote links and images


  Scenario: offline option
    Given the source code contains the file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png">
      """
    When running "text-run --offline"
    Then it signals:
      | MESSAGE | skipping: link to http://google.com |
    And it signals:
      | MESSAGE | skipping: image http://google.com/foo.png |
