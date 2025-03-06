import * as textRunner from "text-runner"

export default function HelloWorld(action: textRunner.actions.Args): void {
  action.log("Hello World from TypeScript!")
}
