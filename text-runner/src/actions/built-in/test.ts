import { ActionArgs } from "../types/action-args"

export default function test(action: ActionArgs) {
  action.log(action.nodes.text())
}
