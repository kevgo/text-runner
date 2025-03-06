Feature: multiple callbacks

  Scenario: synchronous action
    Given the source code contains a file "1.md" with content:
      """
      <a type="multiple-callbacks">
      </a>
      """
    And the source code contains a file "text-runner/multiple-callbacks.js" with content:
      """
      export default function (_, done) {
        done();
        done();
      }
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION             | STATUS  |
      | 1.md     | 1    | multiple-callbacks | success |
