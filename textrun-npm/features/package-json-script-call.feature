Feature: verifying calls of scripts defined in package.json

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

  Scenario: calling an existing script
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call <code type="npm/script-call">npm run alpha</code> on the command line
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION          | ACTIVITY                                |
      | 1.md     | 1    | npm/script-call | verify call of npm package script alpha |

  Scenario: calling a non-existing script
    Given the source code contains a file "1.md" with content:
      """
      To run this app, run <code type="npm/script-call">npm run zonk</code>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION          | STATUS | ERROR TYPE | ERROR MESSAGE                                 |
      | 1.md     | 1    | npm/script-call | failed | UserError  | package.json does not contain a "zonk" script |

  Scenario: missing call signature
    Given the source code contains a file "1.md" with content:
      """
      To run this app, run <code type="npm/script-call">npm alpha</code>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION          | STATUS | ERROR TYPE | ERROR MESSAGE                            |
      | 1.md     | 1    | npm/script-call | failed | UserError  | Does not start with "npm run": npm alpha |
