Feature: validating Javascript

  Scenario: missing Javascript
    Given my source code contains the file "1.md" with content:
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
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="javascript/validate">

      ```
      'missing quotes at end
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                            |
      | LINE          | 1                                               |
      | ERROR MESSAGE | invalid Javascript: Invalid or unexpected token |
      | EXIT CODE     | 1                                               |
