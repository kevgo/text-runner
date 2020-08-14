Feature: validating Javascript

  Scenario: missing Javascript
    Given the source code contains the file "1.md" with content:
      """
      <a textrun="javascript/validate">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | no JavaScript code found |
      | EXIT CODE     | 1                        |

  Scenario: invalid Javascript
    Given the source code contains the file "1.md" with content:
      """
      <pre textrun="javascript/validate">
      'missing quotes at end
      </pre>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                            |
      | LINE          | 1                                               |
      | ERROR MESSAGE | invalid Javascript: Invalid or unexpected token |
      | EXIT CODE     | 1                                               |
