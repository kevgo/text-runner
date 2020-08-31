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
    When calling text-run
    Then it executes these actions:
      | FILENAME | LINE | ACTION             |
      | 1.md     | 1    | multiple-callbacks |
