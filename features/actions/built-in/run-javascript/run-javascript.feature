@verbose
Feature: running inline blocks of Javascript

  As a tutorial writer describing a Javascript tool
  I want to be able to run pieces of inline Javascript code
  So that my tutorial can explain how to use that tool.

  - fenced code blocks wrapped in a "runJavascript" block are executed
  - local variable declarations persist across different code block calls


  Scenario: running Javascript
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      console.log('foobar')
      ```
      </a>
      """
    When running tut-run
    Then it prints:
      """
      foobar
      """


  Scenario: persisting variables across blocks
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      const name = "Jean-Luc Picard"
      ```
      </a>
      <a class="tutorialRunner_runJavascript">
      ```
      console.log("my name is " + name)
      ```
      </a>
      """
    When running tut-run
    Then it prints:
      """
      my name is Jean-Luc Picard
      """


  Scenario: missing code block
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      </a>
      """
    When trying to run tut-run
    Then it signals:
      | FILENAME      | 1.md                    |
      | LINE          | 1                       |
      | MESSAGE       | running JavaScript code |
      | ERROR MESSAGE | no code to run found    |
      | EXIT CODE     | 1                       |


  Scenario: multiple code blocks
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      console.log(name)
      ```
      ```
      console.log(name)
      ```
      </a>
      """
    When trying to run tut-run
    Then it signals:
      | FILENAME      | 1.md                       |
      | LINE          | 1-8                        |
      | MESSAGE       | running JavaScript code    |
      | ERROR MESSAGE | too many code blocks found |
      | EXIT CODE     | 1                          |
