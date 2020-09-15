import { ActionArgs } from "@text-runner/core"

export default function HelloWorld(action: ActionArgs) {
  action.log("Hello World from TypeScript!")
}
