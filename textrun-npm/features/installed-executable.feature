Feature: verifying executables provided by installed npm modules

  Background:
    Given the source code contains a file "node_modules/.bin/up"

  Scenario: correct executable name
    Given the source code contains a file "1.md" with content:
      """
      To get up, call <code type="npm/installed-executable">up</code> on the command line
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                   | ACTIVITY                    |
      | 1.md     | 1    | npm/installed-executable | installed npm executable up |

  Scenario: executable not found
    Given the source code contains a file "1.md" with content:
      """
      To get up, call <code type="npm/installed-executable">zonk</code> on the command line
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                   | STATUS | ERROR TYPE | ERROR MESSAGE                                        |
      | 1.md     | 1    | npm/installed-executable | failed | UserError  | no installed executable node_modules/.bin/zonk found |

  Scenario: missing executable name
    Given the source code contains a file "1.md" with content:
      """
      To get up, call <code type="npm/installed-executable"></code> on the command line
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                   | STATUS | ERROR TYPE | ERROR MESSAGE                 | GUIDANCE                                                                                                                                                                    |
      | 1.md     | 1    | npm/installed-executable | failed | UserError  | Executable name not specified | This action checks for executables provided by npm modules that you have installed. They are typically inside node_modules/.bin. Please provide the name of the executable. |
