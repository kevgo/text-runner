Feature: skipping an action

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a type="skip-action">
      </a>
      """

  Scenario: skipping a synchronous action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      module.exports = (action) => {
        return action.SKIPPING
      }
      """
    When running text-run
    Then it executes:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | ACTION   | skip-action |

  Scenario: skipping an asynchronous action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      module.exports = async (action) => {
        return action.SKIPPING
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Skip action |

  Scenario: skipping a callback action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      module.exports = (action, done) => {
        done(null, action.SKIPPING)
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Skip action |


  Scenario: skipping a promise action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      module.exports = function(action) {
        return new Promise(function(resolve) {
          resolve(action.SKIPPING)
        })
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Skip action |
