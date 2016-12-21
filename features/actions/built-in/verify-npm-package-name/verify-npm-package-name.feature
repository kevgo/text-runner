Feature: verifying the NPM package name

  As the developer of an NPM module
  I want to be able to verify that installation instructions for my module are correct
  So that my readers can start using my tool right away.

  - surround the installation instructions via the "verifyNpmPackageName" action


  Background:
    Given my workspace contains the file "package.json" with the content:
      """
      {
        "name": "my_enormous_package"
      }
      """


  Scenario: correct package name
    Given my workspace contains the file "1.md" with the content:
      """
      To install, run:

      <a class="tutorialRunner_verifyNpmInstall">
      ```
      $ npm i -g my_enormous_package
      ```
      </a>
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md                                       |
      | LINE     | 3-7                                        |
      | MESSAGE  | verifying NPM installs my_enormous_package |


  Scenario: mismatching package name
    Given my workspace contains the file "1.md" with the content:
      """
      To install, run:

      <a class="tutorialRunner_verifyNpmInstall">
      ```
      npm i -g zonk
      ```
      </a>
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                                       |
      | LINE          | 3-7                                        |
      | ERROR MESSAGE | verifying NPM installs my_enormous_package |
      | EXIT CODE     | 1                                          |


