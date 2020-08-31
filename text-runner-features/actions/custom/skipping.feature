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
    When calling text-run
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | skip-action |

  Scenario: skipping an asynchronous action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      module.exports = async (action) => {
        return action.SKIPPING
      }
      """
    When calling text-run
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | skip-action |

  Scenario: skipping a callback action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      module.exports = (action, done) => {
        done(null, action.SKIPPING)
      }
      """
    When calling text-run
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | skip-action |

  Scenario: skipping a promise action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      module.exports = function(action) {
        return new Promise(function(resolve) {
          resolve(action.SKIPPING)
        })
      }
      """
    When calling text-run
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | skip-action |
