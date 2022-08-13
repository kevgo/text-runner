@api
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
      export default (action) => {
        return action.SKIPPING
      }
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, showSkipped: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION      | STATUS  |
      | 1.md     | 1    | skip-action | skipped |

  Scenario: skipping an asynchronous action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      export default async (action) => {
        return action.SKIPPING
      }
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, showSkipped: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION      | STATUS  |
      | 1.md     | 1    | skip-action | skipped |

  Scenario: skipping a callback action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      export default (action, done) => {
        done(null, action.SKIPPING)
      }
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, showSkipped: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION      | STATUS  |
      | 1.md     | 1    | skip-action | skipped |

  Scenario: skipping a promise action
    Given the source code contains a file "text-run/skip-action.js" with content:
      """
      export default (action) => {
        return new Promise(function(resolve) {
          resolve(action.SKIPPING)
        })
      }
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, showSkipped: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION      | STATUS  |
      | 1.md     | 1    | skip-action | skipped |
