@cli
Feature: adding new actions

  Scenario: adding a new step
    When running "text-runner scaffold new-step"
    Then it creates the file "text-runner/new-step.js" with content:
      """
      export default function newStep (action) {
        console.log("This is the implementation of the "new-step" action.")
        console.log('Text inside the semantic document region:', action.region.text())
        console.log("For more information see")
        console.log("https://github.com/kevgo/text-runner/blob/main/documentation/user-defined-actions.md")
      }
      """

  Scenario: adding a new TypeScript step
    When running "text-runner scaffold --ts new-step"
    Then it creates the file "text-runner/new-step.ts" with content:
      """
      import * as textRunner from "text-runner"

      export function newStep (action: textRunner.actions.Args) {
        console.log("This is the implementation of the "new-step" action.")
        console.log('Text inside the semantic document region:', action.region.text())
        console.log("For more information see")
        console.log("https://github.com/kevgo/text-runner/blob/main/documentation/user-defined-actions.md")
      }
      """
