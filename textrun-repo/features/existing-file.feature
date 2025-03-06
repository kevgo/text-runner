Feature: verifying a documented repository file name

  Background:
    Given the source code contains a file "hello.txt" with content:
      """
      Hello world!
      """

  Scenario: file exists
    Given the source code contains a file "1.md" with content:
      """
      <b type="repo/existing-file">hello.txt</b>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION             | ACTIVITY                                     |
      | 1.md     | 1    | repo/existing-file | document mentions source code file hello.txt |


  Scenario: file doesn't exist
    Given the source code contains a file "1.md" with content:
      """
      <b type="repo/existing-file">zonk.txt</b>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION             | STATUS | ERROR TYPE | ERROR MESSAGE            |
      | 1.md     | 1    | repo/existing-file | failed | UserError  | file not found: zonk.txt |
