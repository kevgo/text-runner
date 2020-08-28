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
    When running text-run
    Then it signals:
      | FILENAME | 1.md               |
      | LINE     | 1                  |
      | MESSAGE  | Multiple callbacks |
