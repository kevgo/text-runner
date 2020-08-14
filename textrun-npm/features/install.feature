Feature: verifying NPM installation instructions

  Background:
    Given the source code contains the file "package.json" with content:
      """
      {
        "name": "my_enormous_package"
      }
      """

  Scenario: correct package name with triple-fenced code block
    Given the source code contains the file "1.md" with content:
      """
      To install, run:

      <a textrun="npm/install">

      ```
      $ npm i -g my_enormous_package
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                   |
      | LINE     | 3                                                      |
      | MESSAGE  | check npm package name in npm i -g my_enormous_package |

  Scenario: correct package name inside pre block
    Given the source code contains the file "1.md" with content:
      """
      To install, run:

      <pre textrun="npm/install">
      $ npm i -g my_enormous_package
      </pre>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                |
      | LINE     | 3                                                   |
      | MESSAGE  | check npm package name in npm i -g my_enormous_package |

  Scenario: correct package name with single-fenced code block
    Given the source code contains the file "1.md" with content:
      """
      installation: <a textrun="npm/install">`npm i -g my_enormous_package`</a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                |
      | LINE     | 1                                                   |
      | MESSAGE  | check npm package name in npm i -g my_enormous_package |

  Scenario: mismatching package name
    Given the source code contains the file "1.md" with content:
      """
      To install, run:

      <a textrun="npm/install">

      ```
      npm i -g zonk
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                                                                |
      | LINE          | 3                                                                                                   |
      | ERROR MESSAGE | installation instructions npm i -g zonk don't contain expected npm package name my_enormous_package |
      | EXIT CODE     | 1                                                                                                   |

  Scenario: missing installation instructions
    Given the source code contains the file "1.md" with content:
      """
      To install, run:

      <a textrun="npm/install">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                     |
      | LINE          | 3                                                        |
      | ERROR MESSAGE | Found no nodes of type 'fence/code/fence_open/code_open' |
      | EXIT CODE     | 1                                                        |

  Scenario: missing package name
    Given the source code contains the file "1.md" with content:
      """
      To install, run:

      <a textrun="npm/install">

      ```
      npm i
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                                                        |
      | LINE          | 3                                                                                           |
      | ERROR MESSAGE | installation instructions npm i don't contain expected npm package name my_enormous_package |
      | EXIT CODE     | 1                                                                                           |
