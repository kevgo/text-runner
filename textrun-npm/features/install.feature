Feature: verifying NPM installation instructions

  Background:
    Given the source code contains a file "package.json" with content:
      """
      {
        "name": "my_enormous_package"
      }
      """

  Scenario: correct package name with triple-fenced code block
    Given the source code contains a file "1.md" with content:
      """
      To install, run:

      <a type="npm/install">

      ```
      $ npm i -g my_enormous_package
      ```
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                                               |
      | 1.md     | 3    | npm/install | check npm package name in npm i -g my_enormous_package |

  Scenario: correct package name inside pre block
    Given the source code contains a file "1.md" with content:
      """
      To install, run:

      <pre type="npm/install">
      $ npm i -g my_enormous_package
      </pre>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                                               |
      | 1.md     | 3    | npm/install | check npm package name in npm i -g my_enormous_package |

  Scenario: correct package name with single-fenced code block
    Given the source code contains a file "1.md" with content:
      """
      installation: <a type="npm/install">`npm i -g my_enormous_package`</a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                                               |
      | 1.md     | 1    | npm/install | check npm package name in npm i -g my_enormous_package |

  Scenario: mismatching package name
    Given the source code contains a file "1.md" with content:
      """
      To install, run:

      <a type="npm/install">

      ```
      npm i -g zonk
      ```
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      | STATUS | ERROR TYPE | ERROR MESSAGE                                                                                       |
      | 1.md     | 3    | npm/install | failed | UserError  | installation instructions npm i -g zonk don't contain expected npm package name my_enormous_package |

  Scenario: missing installation instructions
    Given the source code contains a file "1.md" with content:
      """
      To install, run:

      <a type="npm/install">
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      | STATUS | ERROR TYPE | ERROR MESSAGE                      |
      | 1.md     | 3    | npm/install | failed | UserError  | no installation instructions found |

  Scenario: missing package name
    Given the source code contains a file "1.md" with content:
      """
      To install, run:

      <a type="npm/install">

      ```
      npm i
      ```
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      | STATUS | ERROR TYPE | ERROR MESSAGE                                                                               |
      | 1.md     | 3    | npm/install | failed | UserError  | installation instructions npm i don't contain expected npm package name my_enormous_package |
