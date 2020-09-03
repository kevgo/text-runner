@online
Feature: verifying links to websites

  Scenario: markdown link to existing website
    Given the source code contains a file "1.md" with content:
      """
      A [working external link](http://google.com)
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY                                   |
      | 1.md     | 1    | check-link | link to external website http://google.com |


  Scenario: html link to existing website
    Given the source code contains a file "1.md" with content:
      """
      A <a href="http://google.com">working external link</a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY                                   |
      | 1.md     | 1    | check-link | link to external website http://google.com |


  Scenario: markdown link to non-existing website
    Given the source code contains a file "1.md" with content:
      """
      A [broken external link](http://oeanuthaoenuthoaeuzonk.com)
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY                                                   | STATUS | ERROR TYPE | ERROR MESSAGE                  |
      | 1.md     | 1    | check-link | link to external website http://oeanuthaoenuthoaeuzonk.com | failed | UserError  | external website doesn't exist |


  Scenario: HTML link to non-existing website
    Given the source code contains a file "1.md" with content:
      """
      A <a href="http://oeanuthaoenuthoaeuzonk.com">broken external link</a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION     | ACTIVITY                                                   | STATUS | ERROR TYPE | ERROR MESSAGE                  |
      | 1.md     | 1    | check-link | link to external website http://oeanuthaoenuthoaeuzonk.com | failed | UserError  | external website doesn't exist |
