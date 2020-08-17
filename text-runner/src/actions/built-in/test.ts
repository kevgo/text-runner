import { ActionArgs } from "../types/action-args"

export function test(action: ActionArgs) {
  action.log(action.nodes.text())
}
