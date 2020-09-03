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
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION         | ACTIVITY                           |
      | 1.md     | 3    | npm/executable | NPM package exports executable foo |

  Scenario: correct command name with single-fenced code block
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call <a type="npm/executable">`foo`</a> on the command line
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION         | ACTIVITY                           |
      | 1.md     | 1    | npm/executable | NPM package exports executable foo |

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
    When trying to call Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION         | STATUS | ERROR TYPE | ERROR MESSAGE                                 |
      | 1.md     | 3    | npm/executable | failed | UserError  | package.json does not export a "zonk" command |

  Scenario: missing command name
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call:

      <a type="npm/executable">
      </a>
      """
    When trying to call Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION         | STATUS | ERROR TYPE | ERROR MESSAGE                             |
      | 1.md     | 3    | npm/executable | failed | UserError  | No npm package installation command found |
