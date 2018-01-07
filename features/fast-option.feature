Feature: "fast" option

  When running offline
  I want to skip checks of remote links
  So that my test runs.

  - when the option "--fast" is given, TextRunner skips checking remote links and images


  @clionly
  Scenario: fast option via CLI
    Given my source code contains the file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png"></img>
      """
    When running "text-run --fast"
    Then it signals:
      | MESSAGE | skipping link to external website http://google.com |
    And it signals:
      | MESSAGE | skipping external image http://google.com/foo.png |

  @apionly
  Scenario: fast option via API
    Given my source code contains the file "1.md" with content:
      """
      <a href="http://google.com">Google</a>
      <img src="http://google.com/foo.png"></img>
      """
    When running text-run with the arguments {"fast": true}
    Then it signals:
      | MESSAGE | skipping link to external website http://google.com |
    And it signals:
      | MESSAGE | skipping external image http://google.com/foo.png |

