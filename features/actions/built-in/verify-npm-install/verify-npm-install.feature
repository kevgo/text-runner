Feature: verifying NPM installation instructions

  As the developer of an NPM module
  I want to be able to verify that installation instructions for my module are correct
  So that my readers can start using my tool right away.

  - surround the installation instructions via the "verifyNpmPackageName" action


  Background:
    Given my source code contains the file "package.json" with content:
      """
      {
        "name": "my_enormous_package"
      }
      """


  Scenario: correct package name with triple-fenced code block
    Given my source code contains the file "1.md" with content:
      """
      To install, run:

      <a textrun="verify-npm-install">
      ```
      $ npm i -g my_enormous_package
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                    |
      | LINE     | 7                                       |
      | MESSAGE  | verify NPM installs my_enormous_package |


  Scenario: correct package name with single-fenced code block
    Given my source code contains the file "1.md" with content:
      """
      installation: <a textrun="verify-npm-install">`npm i -g my_enormous_package`</a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                    |
      | LINE     | 1                                       |
      | MESSAGE  | verify NPM installs my_enormous_package |


  Scenario: mismatching package name
    Given my source code contains the file "1.md" with content:
      """
      To install, run:

      <a textrun="verify-npm-install">
      ```
      npm i -g zonk
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                            |
      | LINE          | 7                                                               |
      | ERROR MESSAGE | could not find my_enormous_package in installation instructions |
      | EXIT CODE     | 1                                                               |


  Scenario: missing installation instructions
    Given my source code contains the file "1.md" with content:
      """
      To install, run:

      <a textrun="verify-npm-install">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                |
      | LINE          | 3                                                   |
      | MESSAGE       | verify npm install                                  |
      | ERROR MESSAGE | no 'fence' or 'code' tag found in this active block |
      | EXIT CODE     | 1                                                   |


  Scenario: missing package name
    Given my source code contains the file "1.md" with content:
      """
      To install, run:

      <a textrun="verify-npm-install">
      ```
      npm i
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                            |
      | LINE          | 7                                                               |
      | ERROR MESSAGE | could not find my_enormous_package in installation instructions |
      | EXIT CODE     | 1                                                               |
