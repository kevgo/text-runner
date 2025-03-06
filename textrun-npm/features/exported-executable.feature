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

  Scenario: correct command name code block
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call:

      <a type="npm/exported-executable">

      ```shell
      $ foo
      ```
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                  | ACTIVITY                           |
      | 1.md     | 3    | npm/exported-executable | npm package exports executable foo |

  Scenario: correct command name as text
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call <code type="npm/exported-executable">foo</code> on the command line
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                  | ACTIVITY                           |
      | 1.md     | 1    | npm/exported-executable | npm package exports executable foo |

  Scenario: mismatching command name
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call:

      <a type="npm/exported-executable">

      ```
      $ zonk
      ```
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                  | STATUS | ERROR TYPE | ERROR MESSAGE                                 |
      | 1.md     | 3    | npm/exported-executable | failed | UserError  | package.json does not export a "zonk" command |

  Scenario: missing command name
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call:

      <a type="npm/exported-executable">
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                  | STATUS | ERROR TYPE | ERROR MESSAGE                |
      | 1.md     | 3    | npm/exported-executable | failed | UserError  | No executable name specified |
