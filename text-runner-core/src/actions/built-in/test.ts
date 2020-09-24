import { Args } from "../index"

export function test(action: Args): void {
  action.log(action.region.text())
}
