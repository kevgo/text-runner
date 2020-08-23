Feature: verifying global commands provided by NPM modules

  Background:
    Given the source code contains a file "package.json" with content:
      """
      {
        "bin": {
          "foo": "bin/foo"
        }
      }
      """

  Scenario: correct command name with triple-fenced code block
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call:

      <a type="npm/executable">

      ```
      $ foo
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                               |
      | LINE     | 3                                  |
      | MESSAGE  | NPM package exports executable foo |

  Scenario: correct command name with single-fenced code block
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call <a type="npm/executable">`foo`</a> on the command line
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                               |
      | LINE     | 1                                  |
      | MESSAGE  | NPM package exports executable foo |

  Scenario: mismatching command name
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call:

      <a type="npm/executable">

      ```
      $ zonk
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                          |
      | LINE          | 3                                             |
      | ERROR MESSAGE | package.json does not export a "zonk" command |
      | EXIT CODE     | 1                                             |

  Scenario: missing command name
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call:

      <a type="npm/executable">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                      |
      | LINE          | 3                                         |
      | ERROR MESSAGE | No npm package installation command found |
      | EXIT CODE     | 1                                         |
