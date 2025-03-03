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

  @this
  Scenario: script name
    Given the source code contains a file "1.md" with content:
      """
      To run this app, call <code type="npm/script">alpha</code> on the command line
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION     | ACTIVITY                     |
      | 1.md     | 1    | npm/script | npm package has script alpha |

# Scenario: mismatching script name
#   Given the source code contains a file "1.md" with content:
#     """
#     To run this app, run <code type="npm/script">zonk</code>.
#     """
#   When calling Text-Runner
#   Then it emits these events:
#     | FILENAME | LINE | ACTION             | STATUS | ERROR TYPE | ERROR MESSAGE                              |
#     | 1.md     | 3    | npm/script-command | failed | UserError  | package.json does not have a "zonk" script |

# Scenario: missing command name
#   Given the source code contains a file "1.md" with content:
#     """
#     To run this app, call:

#     <a type="npm/exported-executable">
#     </a>
#     """
#   When calling Text-Runner
#   Then it emits these events:
#     | FILENAME | LINE | ACTION                  | STATUS | ERROR TYPE | ERROR MESSAGE                |
#     | 1.md     | 3    | npm/exported-executable | failed | UserError  | No executable name specified |
