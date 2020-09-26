Feature: validating Javascript

  Scenario: missing Javascript
    Given the source code contains a file "1.md" with content:
      """
      <a type="javascript/non-runnable">
      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                  | STATUS | ERROR TYPE | ERROR MESSAGE            |
      | 1.md     | 1    | javascript/non-runnable | failed | UserError  | no JavaScript code found |

  Scenario: invalid Javascript
    Given the source code contains a file "1.md" with content:
      """
      <pre type="javascript/non-runnable">
      'missing quotes at end
      </pre>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                  | STATUS | ERROR TYPE | ERROR MESSAGE                                   |
      | 1.md     | 1    | javascript/non-runnable | failed | UserError  | invalid Javascript: Invalid or unexpected token |
