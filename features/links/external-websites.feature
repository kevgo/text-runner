@online
Feature: verifying links to websites

  As a documentation writer
  I want to know whether links to websites work
  So that I can point my readers to further reading.

  - links pointing to non-existing external websites cause a warning
  - if the parameter "fast" is given, don't check external links


  Scenario: markdown link to existing website
    Given my source code contains the file "1.md" with content:
      """
      A [working external link](http://google.com)
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                       |
      | LINE     | 1                                          |
      | MESSAGE  | link to external website http://google.com |


  Scenario: html link to existing website
    Given my source code contains the file "1.md" with content:
      """
      A <a href="http://google.com">working external link</a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                       |
      | LINE     | 1                                          |
      | MESSAGE  | link to external website http://google.com |


  Scenario: markdown link to non-existing website
    Given my source code contains the file "1.md" with content:
      """
      A [broken external link](http://oeanuthaoenuthoaeuzonk.com)
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                                    |
      | LINE     | 1                                                                       |
      | WARNING  | link to non-existing external website http://oeanuthaoenuthoaeuzonk.com |


  Scenario: HTML link to non-existing website
    Given my source code contains the file "1.md" with content:
      """
      A <a href="http://oeanuthaoenuthoaeuzonk.com">broken external link</a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                                    |
      | LINE     | 1                                                                       |
      | WARNING  | link to non-existing external website http://oeanuthaoenuthoaeuzonk.com |


  @clionly
  Scenario: ignoring external links via the command line
    Given my source code contains the file "1.md" with content:
      """
      A <a href="http://google.com">external link</a>
      """
    When running text-run with the arguments "--fast"
    Then it signals:
      | FILENAME | 1.md                                                |
      | LINE     | 1                                                   |
      | MESSAGE  | skipping link to external website http://google.com |


  @apionly
  Scenario: ignoring external links via the API
    Given my source code contains the file "1.md" with content:
      """
      A <a href="http://google.com">external link</a>
      """
    When running text-run with the arguments {"fast": true}
    Then it signals:
      | FILENAME | 1.md                                                |
      | LINE     | 1                                                   |
      | MESSAGE  | skipping link to external website http://google.com |
