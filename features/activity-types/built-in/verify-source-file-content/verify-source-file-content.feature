Feature: verifying that documentation matches a file in the source code

  As a documentation writer
  I want to be able to show the content of files in example projects in my documentation
  So that my readers can see how things work without having to do steps manually.

  - to show the content of a source code file in the documentation,
    use the "verifySourceFileContent" action
  - provide the filename as bold text
  - provide the expected content as a fenced code block
  - optionally provide a base directory in which the source code file is located
    as a hyperlink to that directory.
    This link is relative to the file in which it occurs.


  Scenario: file content matches
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="verify-source-file-content">
      [global-tool](../documentation/examples/global-tool)
      __text-run.yml__
      ```
      actions:

        runConsoleCommand:
          globals:
            tool: 'public/tool'
      ```
      </a>
      allows you to ...
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                             |
      | LINE     | 11                                                               |
      | MESSAGE  | verifying document content matches source code file text-run.yml |


  Scenario: file content mismatch
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="verify-source-file-content">
      [global-tool](../documentation/examples/global-tool)
      __text-run.yml__
      ```
      zonk
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                             |
      | LINE          | 7                                                                |
      | MESSAGE       | verifying document content matches source code file text-run.yml |
      | ERROR MESSAGE | mismatching content in                                           |
      | EXIT CODE     | 1                                                                |


  Scenario: file does not exist
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="verify-source-file-content">
      [global-tool](not-existing.txt)
      __text-run.yml__
      ```
      zonk
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                             |
      | LINE          | 7                                                                |
      | MESSAGE       | verifying document content matches source code file text-run.yml |
      | ERROR MESSAGE | file .* not found                                                |
      | EXIT CODE     | 1                                                                |
