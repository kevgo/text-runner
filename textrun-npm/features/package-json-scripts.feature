Feature: verifying scripts defined in package.json

  Background:
    Given the source code contains a file "package.json" with content:
      """
      {
        "scripts": {
          "alpha": "echo alpha",
          "beta": "echo beta"
        }
      }
      """

  Scenario: script name
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call <code type="npm/script-name">alpha</code> on the command line
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION          | ACTIVITY                     |
      | 1.md     | 1    | npm/script-name | npm package has script alpha |

  Scenario: mismatching script name
    Given the source code contains a file "1.md" with content:
      """
    To run this app, run <code type="npm/script-name">zonk</code>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION          | STATUS | ERROR TYPE | ERROR MESSAGE                              |
      | 1.md     | 1    | npm/script-name | failed | UserError  | package.json does not have a "zonk" script |

  Scenario: missing command name
    Given the source code contains a file "1.md" with content:
      """
    To run this app, call:

    <a type="npm/script-name">
    </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION          | STATUS | ERROR TYPE | ERROR MESSAGE            |
      | 1.md     | 3    | npm/script-name | failed | UserError  | No script name specified |
