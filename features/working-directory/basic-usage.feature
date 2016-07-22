Feature: separate working directory

  As a tutorial writer
  I want the tests for my tutorial to run in a directory separate from my tutorial
  So that I don't clutter up my tutorial source code with temporary files creating by the tests.

  - by default, the tests run in "./tmp/tut-run/"
  - the test directory can be customized via the "tut-run.yml" file


  Scenario: default configuration
    Given my workspace contains the file "foo.md" with the content:
      """
      <a class="tutorialRunner_createFile">
      __one.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When running "tut-run"
    Then it creates a directory "tmp/tut-run/"
