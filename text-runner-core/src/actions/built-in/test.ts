import { ActionArgs } from "../index"

export function test(action: ActionArgs): void {
  action.log(action.region.text())
}
