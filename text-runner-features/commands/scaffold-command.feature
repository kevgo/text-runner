@cli
Feature: adding new actions

  Scenario: adding a new step
    When running "text-run scaffold new-step"
    Then it creates the file "text-run/new-step.js" with content:
      """
      module.exports = function newStep (action) {
        console.log("This is the implementation of the "new-step" action.")
        console.log('Text inside the semantic document region:', action.region.text())
        console.log("For more information see")
        console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
      }
      """

  Scenario: adding a new TypeScript step
    When running "text-run scaffold --ts new-step"
    Then it creates the file "text-run/new-step.ts" with content:
      """
      import * as tr from "text-runner-core"

      export function newStep (action: tr.actions.Args) {
        console.log("This is the implementation of the "new-step" action.")
        console.log('Text inside the semantic document region:', action.region.text())
        console.log("For more information see")
        console.log("https://github.com/kevgo/text-runner/blob/master/documentation/user-defined-actions.md")
      }
      """
