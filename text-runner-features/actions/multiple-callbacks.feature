@api
Feature: multiple callbacks

  Scenario: synchronous action
    Given the source code contains a file "1.md" with content:
      """
      <a type="multiple-callbacks">
      </a>
      """
    And the source code contains a file "text-run/multiple-callbacks.js" with content:
      """
      module.exports = function (_, done) {
        done();
        done();
      }
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION             | STATUS  |
      | 1.md     | 1    | multiple-callbacks | success |
