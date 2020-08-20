Feature: skipping an action

  As a documentation tester
  I want to be able to skip tests
  So that my test suite can adapt to the particular situation.

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="hello-world">
      </a>
      """

  Scenario: skipping a synchronous action
    Given the source code contains a file "text-run/hello-world.js" with content:
      """
      module.exports = (action) => {
        return action.SKIPPING
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Hello world |

  Scenario: skipping an asynchronous action
    Given the source code contains a file "text-run/hello-world.js" with content:
      """
      module.exports = async (action) => {
        return action.SKIPPING
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Hello world |

  Scenario: skipping a callback action
    Given the source code contains a file "text-run/hello-world.js" with content:
      """
      module.exports = (action, done) => {
        done(null, action.SKIPPING)
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Hello world |


  Scenario: skipping a promise action
    Given the source code contains a file "text-run/hello-world.js" with content:
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
      | MESSAGE  | skipping: Hello world |
