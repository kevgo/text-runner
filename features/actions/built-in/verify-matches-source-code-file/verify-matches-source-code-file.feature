Feature: verifying that documentation matches a file in the source code

  As a tutorial writer
  I want to be able to show the content of files in example projects in my tutorial
  So that my readers can see how things work without having to do steps manually.

  - to show the content of a source code file in the tutorial,
    use the "verifyMatchesSourceCodeFile" action
  - provide the filename as bold text
  - provide the expected content as a fenced code block
  - optionally provide a base directory in which the source code file is located
    as a hyperlink to that directory


  Scenario: file content matches
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_verifyMatchesSourceCodeFile">
      [global-tool](examples/global-tool)
      __tut-run.yml__
      ```
      actions:

        runConsoleCommand:
          globals:
            tool: 'public/tool'
      ```
      </a>
      allows you to ...
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md                                                            |
      | LINE     | 1-11                                                            |
      | MESSAGE  | verifying document content matches source code file tut-run.yml |


  Scenario: file content mismatch
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_verifyMatchesSourceCodeFile">
      [global-tool](examples/global-tool)
      __tut-run.yml__
      ```
      zonk
      ```
      </a>
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                                                            |
      | LINE          | 1-7                                                             |
      | MESSAGE       | verifying document content matches source code file tut-run.yml |
      | ERROR MESSAGE | mismatching content in                                          |
      | EXIT CODE     | 1                                                               |
