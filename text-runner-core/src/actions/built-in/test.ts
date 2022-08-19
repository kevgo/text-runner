import { Args } from "../index.js"

export function test(action: Args): void {
  action.log(action.region.text())
}
