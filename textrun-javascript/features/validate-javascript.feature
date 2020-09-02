Feature: validating Javascript

  Scenario: missing Javascript
    Given the source code contains a file "1.md" with content:
      """
      <a type="javascript/non-runnable">
      </a>
      """
    When trying to run Text-Runner
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | no JavaScript code found |
      | EXIT CODE     | 1                        |

  Scenario: invalid Javascript
    Given the source code contains a file "1.md" with content:
      """
      <pre type="javascript/non-runnable">
      'missing quotes at end
      </pre>
      """
    When trying to run Text-Runner
    Then the test fails with:
      | FILENAME      | 1.md                                            |
      | LINE          | 1                                               |
      | ERROR MESSAGE | invalid Javascript: Invalid or unexpected token |
      | EXIT CODE     | 1                                               |
