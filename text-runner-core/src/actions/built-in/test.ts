import { ActionArgs } from "../types/action-args"

export function test(action: ActionArgs): void {
  action.log(action.region.text())
}
