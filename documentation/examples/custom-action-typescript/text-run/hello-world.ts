import { ActionArgs } from "text-runner"

export default function HelloWorld(action: ActionArgs) {
  action.log("Hello World from TypeScript!")
}
