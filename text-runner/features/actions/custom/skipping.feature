Feature: skipping an action

  As a documentation tester
  I want to be able to skip tests
  So that my test suite can adapt to the particular situation.

  Background:
    Given the source code contains the file "1.md" with content:
      """
      <a textrun="hello-world">
      </a>
      """

  Scenario: skipping a synchronous action
    Given the source code contains the file "text-run/hello-world.js" with content:
      """
      module.exports = (args) => {
        return args.SKIPPING
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Hello world |

  Scenario: skipping an asynchronous action
    Given the source code contains the file "text-run/hello-world.js" with content:
      """
      module.exports = async (args) => {
        return args.SKIPPING
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Hello world |

  Scenario: skipping a callback action
    Given the source code contains the file "text-run/hello-world.js" with content:
      """
      module.exports = (args, done) => {
        done(null, args.SKIPPING)
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Hello world |


  Scenario: skipping a promise action
    Given the source code contains the file "text-run/hello-world.js" with content:
      """
      module.exports = function(args) {
        return new Promise(function(resolve) {
          resolve(args.SKIPPING)
        })
      }
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                  |
      | LINE     | 1                     |
      | MESSAGE  | skipping: Hello world |
