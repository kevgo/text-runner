@clionly
Feature: testing all docs in a subfolder

  As a tutorial writer working on a large collection of documentation
  I want to be able to test only the documents in a particular folder
  So that I get my test result quickly without having to test everything.

  - run "tut-run [folder-to-test]" to test all docs in the given folder


  Scenario: testing all files in a subfolder
    Given my workspace contains the file "commands/foo.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      console.log('foo')
      ```
      </a>
      """
    And my workspace contains the file "readme.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      console.log('readme')
      ```
      </a>
      """
    When running "tut-run commands"
    Then it runs only the tests in "commands/foo.md"
